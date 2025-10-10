<script setup>
import { ref, computed, watch, onBeforeUnmount, nextTick } from 'vue';

const props = defineProps({
  accession: {
    type: String,
    default: 'P07949',
  },
});

const loading = ref(false);
const error = ref('');
const warnMessage = ref('');
const domainLegendText = ref('');
const showScop = ref(true);

const managerRef = ref(null);
const navigationRef = ref(null);
const sequenceRef = ref(null);
const coloredSequenceRef = ref(null);
const domainTrackRef = ref(null);
const regionTrackRef = ref(null);
const siteTrackRef = ref(null);
const bindingTrackRef = ref(null);
const chainTrackRef = ref(null);
const disulfideTrackRef = ref(null);
const strandTrackRef = ref(null);
const scopTrackRef = ref(null);
const variantsTrackRef = ref(null);
const structureRef = ref(null);

const sequenceLength = ref(0);
const structuresOptions = ref([]);
const selectedStructureValue = ref('');
const bundleData = ref(null);
const fixedHighlight = ref('');
const userHighlight = ref('');

let navObserver = null;
let managerClickAttached = false;
let reassertIntervalId = null;
let hydrating = false;

const currentStructureOption = computed(
  () =>
    structuresOptions.value.find((opt) => opt.value === selectedStructureValue.value) ||
    structuresOptions.value[0] ||
    null,
);

const hasData = computed(() => !!bundleData.value && !error.value);

async function fetchJson(url, { fallback = null } = {}) {
  const res = await fetch(url);
  if (!res.ok) {
    if (fallback !== null) return fallback;
    throw new Error(`Request failed (${res.status}) for ${url}`);
  }
  return res.json();
}

function parsePdbStructures(uniprotJson) {
  const out = [];
  const crossRefs = Array.isArray(uniprotJson?.uniProtKBCrossReferences) ? uniprotJson.uniProtKBCrossReferences : [];
  const legacy = Array.isArray(uniprotJson?.dbReferences) ? uniprotJson.dbReferences : [];

  function extract(xr) {
    const id = xr?.id || xr?.accession || xr?.primaryAccession;
    if (!id) return;
    const props = Array.isArray(xr?.properties) ? xr.properties : [];
    const map = {};
    for (const p of props) {
      const key = p?.type || p?.key;
      if (!key) continue;
      map[key] = p?.value ?? '';
    }
    const chainsStr = (map.chains || map.Chains || xr?.chain || '').trim();
    if (!chainsStr) return;
    const parts = chainsStr.split(/[;,]\s*/).filter(Boolean);
    for (const part of parts) {
      const [chainPart, rangesBlob] = part.split('=');
      const chain = chainPart?.trim();
      if (!chain || !rangesBlob) continue;
      const ranges = rangesBlob.split(',').map((seg) => seg.trim()).filter(Boolean);
      const mappings = [];
      for (const seg of ranges) {
        const [start, end] = seg.split('-').map((v) => Number(v.trim()));
        if (Number.isFinite(start) && Number.isFinite(end)) {
          mappings.push({ uniprot_start: Math.min(start, end), uniprot_end: Math.max(start, end) });
        }
      }
      if (mappings.length) {
        out.push({
          id,
          source: 'PDB',
          chain,
          label: `${id} — chain ${chain}`,
          mappings,
        });
      }
    }
  }

  crossRefs.filter((xr) => (xr.database || xr.type) === 'PDB').forEach(extract);
  legacy.filter((xr) => xr.type === 'PDB').forEach(extract);
  return out;
}

function mergePositionsToRanges(positions) {
  const sorted = Array.from(new Set(positions.filter((p) => Number.isFinite(p)))).sort((a, b) => a - b);
  if (!sorted.length) return [];
  const ranges = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i < sorted.length; i += 1) {
    const value = sorted[i];
    if (value === prev + 1) {
      prev = value;
    } else {
      ranges.push([start, prev]);
      start = value;
      prev = value;
    }
  }
  ranges.push([start, prev]);
  return ranges;
}

function rangesToString(ranges) {
  return ranges.map(([s, e]) => `${s}:${e}`).join(',');
}

function parseRanges(str) {
  if (!str) return [];
  return str
    .split(',')
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [a, b] = chunk.split(':').map(Number);
      if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
      return [Math.min(a, b), Math.max(a, b)];
    })
    .filter(Boolean)
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function mergeRanges(ranges) {
  if (!ranges.length) return [];
  const sorted = [...ranges].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const merged = [];
  let [currentStart, currentEnd] = sorted[0];
  for (let i = 1; i < sorted.length; i += 1) {
    const [start, end] = sorted[i];
    if (start <= currentEnd + 1) {
      currentEnd = Math.max(currentEnd, end);
    } else {
      merged.push([currentStart, currentEnd]);
      currentStart = start;
      currentEnd = end;
    }
  }
  merged.push([currentStart, currentEnd]);
  return merged;
}

function unionRanges(aStr, bStr) {
  return rangesToString(mergeRanges([...parseRanges(aStr), ...parseRanges(bStr)]));
}

function intersectWithAllowed(highlightStr, allowedRanges) {
  const highlights = parseRanges(highlightStr);
  if (!allowedRanges?.length) {
    return rangesToString(mergeRanges(highlights));
  }
  const segments = [];
  for (const [hs, he] of highlights) {
    for (const mapping of allowedRanges) {
      const start = Math.max(hs, Number(mapping.uniprot_start));
      const end = Math.min(he, Number(mapping.uniprot_end));
      if (start <= end) {
        segments.push([start, end]);
      }
    }
  }
  return rangesToString(mergeRanges(segments));
}

async function buildBundle(accession) {
  const [features, variation, uniprot, scop3p] = await Promise.all([
    fetchJson(`https://www.ebi.ac.uk/proteins/api/features/${accession}`),
    fetchJson(`https://www.ebi.ac.uk/proteins/api/variation/${accession}`, { fallback: { features: [] } }),
    fetchJson(`https://rest.uniprot.org/uniprotkb/${accession}.json`),
    fetchJson(`https://iomics.ugent.be/scop3p/api/modifications?accession=${accession}`, { fallback: { modifications: [] } }),
  ]);

  const sequence = features?.sequence ?? '';
  if (!sequence) {
    throw new Error(`No sequence returned for accession ${accession}`);
  }

  const structures = [
    {
      id: `AF-${accession}-F1`,
      source: 'AFDB',
      chain: null,
      label: `AlphaFold (AF-${accession}-F1)`,
      mappings: [{ uniprot_start: 1, uniprot_end: sequence.length }],
    },
    ...parsePdbStructures(uniprot),
  ];

  const phospho = (scop3p?.modifications || []).filter(
    (m) => String(m?.name || '').toLowerCase() === 'phosphorylation' && Number.isFinite(Number(m?.position)),
  );
  const phosphoSites = phospho.map((m) => ({
    pos: Number(m.position),
    residue: String(m?.residue || '?').slice(0, 1),
    source: m?.source || 'Scop3P',
  }));
  const highlightRanges = mergePositionsToRanges(phosphoSites.map((s) => s.pos));
  const compactHighlight = rangesToString(highlightRanges);

  return {
    accession,
    features,
    variation,
    structures,
    scop3p,
    scop3pCompact: {
      phosphoSites,
      highlight: compactHighlight,
    },
  };
}

function setElementLength(el, len) {
  if (!el) return;
  el.length = len;
  el.setAttribute('length', String(len));
  el.displayStart = 1;
  el.displayEnd = len;
  el.setAttribute('display-start', '1');
  el.setAttribute('display-end', String(len));
}

function setWarn(message) {
  warnMessage.value = message || '';
}

function enforceGrey() {
  if (!structureRef.value) return;
  structureRef.value.setAttribute('color-theme', 'uniform');
  structureRef.value.setAttribute('color-value', '#9ca3af');
  structureRef.value.colorTheme = 'uniform';
  structureRef.value.colorValue = '#9ca3af';
  structureRef.value.requestUpdate?.();
}

function clearReassertInterval() {
  if (reassertIntervalId) {
    clearInterval(reassertIntervalId);
    reassertIntervalId = null;
  }
}

function reassert(option, times = 6, delay = 200) {
  clearReassertInterval();
  if (!option || times <= 0) return;
  let counter = 0;
  reassertIntervalId = setInterval(() => {
    counter += 1;
    enforceGrey();
    applyStructure(option, { skipWarn: true });
    if (counter >= times) {
      clearReassertInterval();
    }
  }, delay);
}

function applyStructure(option, { skipWarn = false } = {}) {
  if (!option || !structureRef.value) return;
  const baseHighlight = showScop.value ? fixedHighlight.value : '';
  const merged = unionRanges(baseHighlight, userHighlight.value || '');
  const clamped =
    option.source === 'PDB' && option.mappings?.length
      ? intersectWithAllowed(merged, option.mappings)
      : merged;

  if (!skipWarn) {
    if (merged && !clamped) {
      setWarn('Selected PDB-chain does not cover the highlighted residues; highlight omitted.');
    } else {
      setWarn('');
    }
  }

  structureRef.value.setAttribute('protein-accession', props.accession);
  structureRef.value.setAttribute('structure-id', option.structureId);
  enforceGrey();
  structureRef.value.setAttribute('highlight', clamped);
  structureRef.value.setAttribute('highlight-color', 'red');
}

function applyStructureWithReassert(times = 6, delay = 200) {
  if (hydrating) return;
  const option = currentStructureOption.value;
  if (!option) return;
  applyStructure(option);
  reassert(option, times, delay);
}

function handleStructureChange() {
  applyStructureWithReassert();
}

function handleShowScopChange() {
  applyStructureWithReassert(3, 180);
}

function handleManagerClick() {
  userHighlight.value = navigationRef.value?.getAttribute('highlight') || '';
  const option = currentStructureOption.value;
  if (!option) return;
  applyStructure(option);
}

function setupHighlightSync() {
  if (navObserver) {
    navObserver.disconnect();
    navObserver = null;
  }
  if (navigationRef.value) {
    navObserver = new MutationObserver(() => {
      userHighlight.value = navigationRef.value?.getAttribute('highlight') || '';
      applyStructureWithReassert(2, 150);
    });
    navObserver.observe(navigationRef.value, { attributes: true, attributeFilter: ['highlight'] });
  }
  if (managerRef.value && !managerClickAttached) {
    managerRef.value.addEventListener('click', handleManagerClick);
    managerClickAttached = true;
  }
}

function detachHighlightSync() {
  if (navObserver) {
    navObserver.disconnect();
    navObserver = null;
  }
  if (managerRef.value && managerClickAttached) {
    managerRef.value.removeEventListener('click', handleManagerClick);
    managerClickAttached = false;
  }
  clearReassertInterval();
}

async function renderBundle(bundle) {
  hydrating = true;
  await nextTick();

  const len = bundle.features.sequence.length;
  sequenceLength.value = len;

  const targets = [
    navigationRef.value,
    sequenceRef.value,
    coloredSequenceRef.value,
    domainTrackRef.value,
    regionTrackRef.value,
    siteTrackRef.value,
    bindingTrackRef.value,
    chainTrackRef.value,
    disulfideTrackRef.value,
    strandTrackRef.value,
    scopTrackRef.value,
    variantsTrackRef.value,
  ];
  targets.forEach((el) => setElementLength(el, len));

  if (sequenceRef.value) {
    sequenceRef.value.data = bundle.features.sequence;
  }
  if (coloredSequenceRef.value) {
    coloredSequenceRef.value.data = bundle.features.sequence;
  }

  const features = Array.isArray(bundle.features?.features) ? bundle.features.features : [];
  const normalized = features.map((f) => ({
    ...f,
    start: Number.isFinite(f.start) ? f.start : f.begin,
  }));

  if (domainTrackRef.value) {
    domainTrackRef.value.data = normalized
      .filter((f) => f.type === 'DOMAIN')
      .map((f) => ({
        ...f,
        label: f.description || f.type || 'domain',
      }));
  }
  if (regionTrackRef.value) {
    regionTrackRef.value.data = normalized.filter((f) => f.type === 'REGION');
  }
  if (siteTrackRef.value) {
    siteTrackRef.value.data = normalized.filter((f) => f.type === 'SITE');
  }
  if (bindingTrackRef.value) {
    bindingTrackRef.value.data = normalized.filter((f) => f.type === 'BINDING');
  }
  if (chainTrackRef.value) {
    chainTrackRef.value.data = normalized.filter((f) => f.type === 'CHAIN');
  }
  if (disulfideTrackRef.value) {
    disulfideTrackRef.value.data = normalized.filter((f) => f.type === 'DISULFID');
  }
  if (strandTrackRef.value) {
    strandTrackRef.value.data = normalized.filter((f) => f.type === 'STRAND');
  }

  const domainLabels = (domainTrackRef.value?.data || [])
    .slice(0, 12)
    .map((d) => `${d.label || d.description || 'domain'} (${d.start}-${d.end})`);
  domainLegendText.value =
    domainLabels.length > 0
      ? `Domains: ${domainLabels.join(' · ')}${(domainTrackRef.value?.data || []).length > 12 ? ' …' : ''}`
      : '';

  const variantCounts = new Map();
  for (const variant of bundle.variation.features || []) {
    const pos = Number(variant.begin);
    if (!Number.isFinite(pos)) continue;
    variantCounts.set(pos, (variantCounts.get(pos) || 0) + 1);
  }
  if (variantsTrackRef.value) {
    const values = Array.from(variantCounts, ([position, value]) => ({ position, value })).sort(
      (a, b) => a.position - b.position,
    );
    const maxValue = values.length ? Math.max(...values.map((d) => d.value)) : 0;
    variantsTrackRef.value.data = [
      {
        color: 'grey',
        values,
        range: [0, Math.max(1, maxValue)],
      },
    ];
  }

  if (scopTrackRef.value) {
    scopTrackRef.value.data = (bundle.scop3p?.modifications || [])
      .filter((m) => String(m?.name || '').toLowerCase() === 'phosphorylation')
      .filter((m) => Number.isFinite(Number(m?.position)))
      .map((m) => ({
        start: Number(m.position),
        end: Number(m.position),
        type: 'SCOP3P_PHOSPHO',
        description: `Phospho ${String(m.residue || '?').slice(0, 1)}@${m.position} (${m.source || 'Scop3P'})`,
      }));
  }

  fixedHighlight.value = bundle.scop3pCompact.highlight || '';
  userHighlight.value = navigationRef.value?.getAttribute('highlight') || '';

  structuresOptions.value = bundle.structures.map((s) => ({
    value: s.source === 'PDB' && s.chain ? `${s.id}|${s.chain}` : s.id,
    label: s.label || (s.source === 'PDB' ? `${s.id} — chain ${s.chain || '?'}` : s.id),
    source: s.source || '',
    mappings: Array.isArray(s.mappings) ? s.mappings : [],
    structureId: s.id,
  }));

  const preferred = structuresOptions.value.find((opt) => opt.value.startsWith(`AF-${bundle.accession}-F1`));
  selectedStructureValue.value = (preferred || structuresOptions.value[0] || { value: '' }).value;
  setWarn('');

  setupHighlightSync();

  hydrating = false;
  applyStructureWithReassert();
}

async function loadData(accession) {
  loading.value = true;
  error.value = '';
  setWarn('');
  try {
    const bundle = await buildBundle(accession);
    bundleData.value = bundle;
    await renderBundle(bundle);
  } catch (err) {
    console.error(err);
    error.value = err instanceof Error ? err.message : String(err);
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.accession,
  (next) => {
    detachHighlightSync();
    bundleData.value = null;
    structuresOptions.value = [];
    domainLegendText.value = '';
    fixedHighlight.value = '';
    selectedStructureValue.value = '';
    showScop.value = true;
    if (next) {
      loadData(next);
    }
  },
  { immediate: true },
);

watch(showScop, () => {
  if (!hydrating) {
    handleShowScopChange();
  }
});

onBeforeUnmount(() => {
  detachHighlightSync();
});
</script>

<template>
  <div class="structure-viewer">
    <div class="hint">
      1D left · 3D right. Click in 1D to select; Scop3P overlay is toggleable. PDB highlights auto-clamped.
    </div>
    <div class="warn" v-if="warnMessage">{{ warnMessage }}</div>
    <div class="warn error" v-if="error">{{ error }}</div>
    <div class="warn loading" v-if="loading && !error">Loading Nightingale tracks…</div>

    <div class="grid" v-if="hasData">
      <div class="left">
        <nightingale-manager ref="managerRef">
          <table>
            <tbody>
              <tr>
                <td></td>
                <td>
                  <nightingale-navigation
                    ref="navigationRef"
                    min-width="800"
                    height="40"
                    :length="sequenceLength"
                    display-start="1"
                    :display-end="sequenceLength"
                    margin-color="white"
                    highlight-event="onclick"
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <nightingale-sequence
                    ref="sequenceRef"
                    min-width="800"
                    height="40"
                    :length="sequenceLength"
                    display-start="1"
                    :display-end="sequenceLength"
                    margin-color="white"
                    highlight-event="onclick"
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <nightingale-colored-sequence
                    ref="coloredSequenceRef"
                    min-width="800"
                    height="15"
                    :length="sequenceLength"
                    display-start="1"
                    :display-end="sequenceLength"
                    scale="hydrophobicity-scale"
                    margin-color="white"
                    highlight-event="onclick"
                  />
                </td>
              </tr>
              <tr>
                <td>Domain</td>
                <td>
                  <nightingale-track
                    ref="domainTrackRef"
                    min-width="800"
                    height="18"
                    :length="sequenceLength"
                    display-start="1"
                    :display-end="sequenceLength"
                    margin-color="aliceblue"
                    display-labels="true"
                    highlight-event="onclick"
                  />
                  <div class="legend" v-if="domainLegendText">{{ domainLegendText }}</div>
                </td>
              </tr>
              <tr>
                <td>Region</td>
                <td>
                  <nightingale-track
                    ref="regionTrackRef"
                    min-width="800"
                    height="15"
                    :length="sequenceLength"
                    display-start="1"
                    :display-end="sequenceLength"
                    margin-color="aliceblue"
                    highlight-event="onclick"
                  />
                </td>
              </tr>
              <tr>
                <td>Site</td>
                <td>
                  <nightingale-track
                    ref="siteTrackRef"
                    min-width="800"
                    height="15"
                    :length="sequenceLength"
                    display-start="1"
                    :display-end="sequenceLength"
                    margin-color="aliceblue"
                    highlight-event="onclick"
                  />
                </td>
              </tr>
              <tr>
                <td>Chain</td>
                <td>
                  <nightingale-track
                    ref="chainTrackRef"
                    layout="non-overlapping"
                    min-width="800"
                    height="15"
                    :length="sequenceLength"
                    display-start="1"
                    :display-end="sequenceLength"
                    margin-color="aliceblue"
                    highlight-event="onclick"
                  />
                </td>
              </tr>
              <tr>
                <td>Binding site</td>
                <td>
                  <nightingale-track
                    ref="bindingTrackRef"
                    min-width="800"
                    height="15"
                    :length="sequenceLength"
                    display-start="1"
                    :display-end="sequenceLength"
                    margin-color="aliceblue"
                    highlight-event="onclick"
                  />
                </td>
              </tr>
              <tr>
                <td>Disulfide bond</td>
                <td>
                  <nightingale-track
                    ref="disulfideTrackRef"
                    layout="non-overlapping"
                    min-width="800"
                    height="15"
                    :length="sequenceLength"
                    display-start="1"
                    :display-end="sequenceLength"
                    margin-color="aliceblue"
                    highlight-event="onclick"
                  />
                </td>
              </tr>
              <tr>
                <td>Beta strand</td>
                <td>
                  <nightingale-track
                    ref="strandTrackRef"
                    min-width="800"
                    height="15"
                    :length="sequenceLength"
                    display-start="1"
                    :display-end="sequenceLength"
                    margin-color="aliceblue"
                    highlight-event="onclick"
                  />
                </td>
              </tr>
              <tr>
                <td>Scop3P phosphorylation</td>
                <td>
                  <nightingale-track
                    ref="scopTrackRef"
                    min-width="800"
                    height="15"
                    :length="sequenceLength"
                    display-start="1"
                    :display-end="sequenceLength"
                    margin-color="aliceblue"
                    highlight-event="onclick"
                  />
                </td>
              </tr>
              <tr>
                <td>Variants</td>
                <td>
                  <nightingale-linegraph-track
                    ref="variantsTrackRef"
                    min-width="800"
                    height="60"
                    :length="sequenceLength"
                    display-start="1"
                    :display-end="sequenceLength"
                    margin-color="aliceblue"
                    highlight-event="onclick"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </nightingale-manager>
      </div>

      <div class="right">
        <div class="panel">
          <div class="controls">
            <label>
              Structure
              <select v-model="selectedStructureValue" @change="handleStructureChange">
                <option v-for="opt in structuresOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </label>
            <label class="toggle">
              <input type="checkbox" v-model="showScop" />
              Show Scop3P sites
            </label>
          </div>
          <nightingale-structure
            ref="structureRef"
            :protein-accession="props.accession"
            structure-id="AF-placeholder"
            color-theme="uniform"
            color-value="#9ca3af"
            highlight-color="red"
            style="--custom-structure-height: var(--panel-height);"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.structure-viewer {
  --panel-height: 560px;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  color: #111827;
}

.hint {
  color: #374151;
  font-size: 0.9rem;
  padding: 0 16px;
  margin-top: 12px;
}

.warn {
  color: #b45309;
  font-size: 0.85rem;
  padding: 4px 16px 0;
}

.warn.error {
  color: #b91c1c;
}

.warn.loading {
  color: #2563eb;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 16px;
  align-items: stretch;
}

.left {
  overflow: auto;
  border-right: 1px solid #e5e7eb;
  padding-right: 8px;
  min-height: var(--panel-height);
}

.right {
  display: flex;
  flex-direction: column;
  height: var(--panel-height);
}

.panel {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.controls {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  color: #374151;
  font-size: 0.9rem;
}

.controls select {
  margin-left: 6px;
  padding: 4px 6px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: white;
  color: inherit;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 12px;
}

table {
  border-collapse: collapse;
  width: 100%;
}

td {
  padding: 5px;
}

td:first-child {
  background-color: lightcyan;
  font: 0.8em sans-serif;
  white-space: nowrap;
}

td:nth-child(2) {
  background-color: aliceblue;
}

tr:nth-child(-n + 3) > td {
  background-color: transparent;
}

.legend {
  font-size: 12px;
  color: #374151;
  margin: 6px 0 0;
}
</style>
