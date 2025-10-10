<template>
  <div ref="containerEl" :style="containerStyle"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue';
import Sigma from 'sigma';
import Graph from 'graphology';

const props = defineProps({
  nodes: { type: Array, default: () => [] },
  edges: { type: Array, default: () => [] },
  sigmaSettings: { type: Object, default: () => ({}) },
  width: { type: [Number, String], default: undefined },
  height: { type: [Number, String], default: undefined },
  // If true, rebuilds the whole graph when inputs change; else minimal diff
  rebuildOnChange: { type: Boolean, default: false },
});

const emit = defineEmits(['nodeClick', 'edgeClick', 'stageClick']);

const containerEl = ref(null);
const sigmaRef = ref(null);
const graphRef = ref(null);
const resizeObs = ref(null);

const toCssSize = (v, fallback) => (v == null ? fallback : typeof v === 'number' ? `${v}px` : String(v));

const containerStyle = computed(() => ({
  width: toCssSize(props.width, '100%'),
  height: toCssSize(props.height, '100%'),
  display: 'block',
}));

function ensureNode(g, node) {
  const { id, ...attrs } = node;
  if (!g.hasNode(id)) g.addNode(id, attrs);
  else g.mergeNodeAttributes(id, attrs);
}

function ensureEdge(g, e) {
  const { source, target } = e;
  const id = e.id || `${source}->${target}`;
  const attrs = { ...e };
  delete attrs.id; delete attrs.source; delete attrs.target;

  if (g.hasEdge(id)) {
    g.mergeEdgeAttributes(id, attrs);
    return;
  }
  if (!g.hasNode(source)) g.addNode(source, {});
  if (!g.hasNode(target)) g.addNode(target, {});
  g.addEdgeWithKey(id, source, target, attrs);
}

function buildGraph(nodes, edges) {
  const g = new Graph({ multi: false, type: 'undirected' });
  nodes.forEach(n => ensureNode(g, n));
  edges.forEach(e => ensureEdge(g, e));
  return g;
}

function diffSyncGraph(g, nodes, edges) {
  const incomingNodeIds = new Set(nodes.map(n => n.id));
  nodes.forEach(n => ensureNode(g, n));
  g.forEachNode(id => { if (!incomingNodeIds.has(id)) g.dropNode(id); });

  const edgeKey = e => e.id || `${e.source}->${e.target}`;
  const incomingEdgeIds = new Set(edges.map(edgeKey));
  edges.forEach(e => ensureEdge(g, e));
  g.forEachEdge(id => { if (!incomingEdgeIds.has(id)) g.dropEdge(id); });
}

function attachSigmaEvents(sigma) {
  sigma.on('clickNode', payload => emit('nodeClick', payload));
  sigma.on('clickEdge', payload => emit('edgeClick', payload));
  sigma.on('clickStage', payload => emit('stageClick', payload));
}
function detachSigmaEvents(sigma) {
  sigma.off('clickNode'); sigma.off('clickEdge'); sigma.off('clickStage');
}
function applySigmaSettings(sigma, settings) {
  if (!sigma || !settings) return;
  Object.entries(settings).forEach(([k, v]) => {
    try { sigma.setSetting(k, v); }
    catch (err) { console.warn(`[Network] Failed to set setting "${k}"`, err); }
  });
}

onMounted(async () => {
  await nextTick();
  if (!containerEl.value) {
    console.error('[Network] No container element available.');
    return;
  }

  const g = buildGraph(props.nodes, props.edges);
  graphRef.value = g;

  const sigma = new Sigma(g, containerEl.value, props.sigmaSettings || {});
  sigmaRef.value = sigma;

  attachSigmaEvents(sigma);

  if (typeof ResizeObserver !== 'undefined') {
    resizeObs.value = new ResizeObserver(() => {
      try { sigma.refresh(); } catch (err) { console.warn('[Network] refresh on resize failed', err); }
    });
    resizeObs.value.observe(containerEl.value);
  }

  sigma.refresh();
});

onUnmounted(() => {
  try { if (sigmaRef.value) { detachSigmaEvents(sigmaRef.value); sigmaRef.value.kill(); } }
  catch (err) { console.warn('[Network] Error during sigma teardown', err); }
  finally { sigmaRef.value = null; }

  try { if (graphRef.value) { graphRef.value.clear(); graphRef.value = null; } }
  catch (err) { console.warn('[Network] Error during graph teardown', err); }

  try { if (resizeObs.value && containerEl.value) resizeObs.value.unobserve(containerEl.value); }
  catch (err) { console.warn('[Network] Error disconnecting ResizeObserver', err); }
  finally { resizeObs.value = null; }
});

watch(
  () => [props.nodes, props.edges, props.rebuildOnChange],
  ([nodes, edges, rebuild]) => {
    const sigma = sigmaRef.value;
    if (!sigma) return;

    if (rebuild) {
      const newGraph = buildGraph(nodes || [], edges || []);
      sigma.setGraph(newGraph);
      if (graphRef.value) graphRef.value.clear();
      graphRef.value = newGraph;
    } else {
      if (!graphRef.value) {
        graphRef.value = buildGraph(nodes || [], edges || []);
        sigma.setGraph(graphRef.value);
      } else {
        diffSyncGraph(graphRef.value, nodes || [], edges || []);
      }
    }
    sigma.refresh();
  },
  { deep: true }
);

watch(
  () => props.sigmaSettings,
  (settings) => { if (sigmaRef.value) applySigmaSettings(sigmaRef.value, settings || {}); },
  { deep: true }
);
</script>

<style scoped>
:host {
  box-sizing: border-box;
}
</style>
