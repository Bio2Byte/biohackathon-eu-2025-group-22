<template>
  <div class="topology-wrapper" :style="wrapperStyle">
    <!-- The PDBe web component -->
    <pdb-topology-viewer
      ref="topologyEl"
      :entry-id="entryId"
      :entity-id="entityId"
      :chain-id="chainId || undefined"
      :display-style="displayStyle || undefined"
      :error-style="errorStyle || undefined"
      :subscribe-events="String(subscribeEvents)"
      class="pdb-topology-host"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';

/**
 * Props based on PDBe Topology Viewer web component attributes:
 * - entryId        (required) PDB ID, e.g. "1cbs"
 * - entityId       (required) entity ID, e.g. "1"
 * - chainId        (optional) chain ID, e.g. "A" (best chain auto-picked if omitted)
 * - displayStyle   (optional) CSS string applied to the display box
 * - errorStyle     (optional) CSS string applied to the error box
 * - subscribeEvents(optional) string/boolean; true to allow cross-component event wiring
 * - width/height   (optional) for the wrapper sizing
 */
const props = defineProps({
  entryId: { type: String, required: true },
  entityId: { type: [String, Number], required: true },
  chainId: { type: String, default: '' },
  displayStyle: { type: String, default: '' },
  errorStyle: { type: String, default: '' },
  subscribeEvents: { type: [Boolean, String], default: true },
  width: { type: [String, Number], default: '640px' },
  height: { type: [String, Number], default: '360px' },
});

const topologyEl = ref(null);
let destroyed = false;

/** Normalize numeric width/height to px for convenience. */
const wrapperStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  position: 'relative',
}));

/* ------------ Loader for the PDBe Topology Viewer scripts (per docs) -------- */

let loadPromise;

function ensureTopologyScripts() {
  if (window.customElements?.get?.('pdb-topology-viewer')) return Promise.resolve();
  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      try {
        // d3 dependency (as in docs)
        injectScriptOnce(
          'pdb-topology-d3',
          'https://cdn.jsdelivr.net/npm/d3@5.9.2',
          'defer'
        );

        // Web components polyfills (kept from docs for widest support; harmless if modern browser)
        injectScriptOnce(
          'pdb-wc-polyfill-lite',
          'https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs/webcomponents-lite.js',
          'defer'
        );
        injectScriptOnce(
          'pdb-wc-custom-elements-es5',
          'https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
          'defer'
        );

        // The topology viewer component script (use the URL from the wiki)
        injectScriptOnce(
          'pdb-topology-viewer-component',
          'https://www.ebi.ac.uk/pdbe/pdb-component-library/js/pdb-topology-viewer-component-2.0.0.js',
          'defer'
        );

        // Wait until the custom element is defined
        const start = Date.now();
        const timeoutMs = 15000;
        const t = setInterval(() => {
          if (window.customElements?.get?.('pdb-topology-viewer')) {
            clearInterval(t);
            resolve();
          } else if (Date.now() - start > timeoutMs) {
            clearInterval(t);
            reject(new Error('pdb-topology-viewer custom element did not register in time'));
          }
        }, 50);
      } catch (e) {
        reject(e);
      }
    });
  }
  return loadPromise;
}

function injectScriptOnce(id, src, mode = 'defer') {
  if (document.getElementById(id)) return;
  const s = document.createElement('script');
  s.id = id;
  s.src = src;
  if (mode === 'defer') s.defer = true;
  s.async = false; // preserve order
  document.head.appendChild(s);
}

/* ------------------------------ Lifecycle & watch -------------------------- */

onMounted(async () => {
  try {
    await ensureTopologyScripts();
    // Initial attribute sync happens automatically via Vue bindings.
  } catch (e) {
    console.error('[Topology] Failed to load PDBe Topology Viewer scripts:', e);
  }
});

onBeforeUnmount(() => {
  destroyed = true;
  // No explicit dispose API for the web component; GC will clean it up.
});

/**
 * If you want to react to changes programmatically (beyond attribute binding),
 * you can watch props and call methods on the element here. The component
 * handles attribute binding declaratively already, so this is mostly for hooks.
 */
watch(
  () => [props.entryId, props.entityId, props.chainId, props.displayStyle, props.errorStyle, props.subscribeEvents],
  (vals) => {
    if (!topologyEl.value) return;
    // Attributes already bound via template; this is just a debug hook.
    // console.info('[Topology] props changed ->', vals);
  }
);
</script>

<style scoped>
.topology-wrapper {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  overflow: hidden;
}

.pdb-topology-host {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
