<template>
    <div class="viewer-wrapper">
      <pdbe-molstar
        ref="molstarEl"
        class="molstar"
        :style="inlineStyle"
        :molecule-id="normalizedId"
        :hide-controls="hideControls ? 'true' : 'false'"
        :bg-color-r="bgColorR"
        :bg-color-g="bgColorG"
        :bg-color-b="bgColorB"
        :load-dimensions="loadDensity ? 'true' : 'false'"
        :preset="preset"
        expanded="false"
        landscape="false"
        reactive="false"
        hide-water="true"
        hide-het="true"
        hide-non-standard="true"
        load-maps="false"
        sequence-panel="false"
        loading-overlay="true"
      ></pdbe-molstar>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// 1) Load the web component & its CSS (critical).
import 'pdbe-molstar/build/pdbe-molstar-component.js';
import 'pdbe-molstar/build/pdbe-molstar.css';
/**
 * Props
 * - moleculeId: PDB id (e.g., "1CBS" or "1cbs"). We'll normalize to lowercase.
 * - width/height: CSS sizes (number -> px, string -> raw).
 * - hideControls: hide UI panels (PDBe attribute "hide-controls")
 * - bgColor: background color (e.g., "#ffffff" or "black")
 * - loadDensity: whether to load maps (example toggle mapped to "load-dimensions")
 * - preset: PDBe preset string if you use any (leave empty by default)
 */
const props = defineProps({
  moleculeId: { type: String, required: true, default: '1CBS' },
  width: { type: [Number, String], default: 800 },
  height: { type: [Number, String], default: 500 },
  hideControls: { type: Boolean, default: false },
  bgColorR: { type: String, default: 255 },
  bgColorG: { type: String, default: 255 },
  bgColorB: { type: String, default: 255 },
  loadDensity: { type: Boolean, default: false },
  preset: { type: String, default: '' },
});

// Element ref
const molstarEl = ref(null);

// Normalize id to lowercase (PDBe demos use lowercase)
const normalizedId = computed(() => (props.moleculeId || '').toLowerCase());

// Inline sizing
const toCss = (v) => (typeof v === 'number' ? `${v}px` : String(v));
const inlineStyle = computed(() => ({
  width: toCss(parseInt(props.width)),
  height: toCss(parseInt(props.height)),
  display: 'block',
}));

// Ensure custom element is defined before we poke attributes programmatically
onMounted(async () => {
  await customElements.whenDefined('pdbe-molstar');
  if (!molstarEl.value) return;

  // Defensive re-apply in case initial attribute binding raced the definition:
  setAttr('molecule-id', normalizedId.value);
  setAttr('hide-controls', props.hideControls ? 'true' : 'false');
  setAttr('bg-color', props.bgColor);
  setAttr('load-dimensions', props.loadDensity ? 'true' : 'false');
  if (props.preset) setAttr('preset', props.preset);
});

// Helper to set attributes safely
function setAttr(name, value) {
  if (!molstarEl.value) return;
  if (value === undefined || value === null || value === '') {
    molstarEl.value.removeAttribute(name);
  } else {
    molstarEl.value.setAttribute(name, value);
  }
}

// React to prop changes and update attributes
watch(
  () => [
    normalizedId.value,
    props.hideControls,
    props.bgColor,
    props.loadDensity,
    props.preset,
  ],
  ([id, hide, bg, density, preset]) => {
    if (!molstarEl.value) return;
    setAttr('molecule-id', id);
    setAttr('hide-controls', hide ? 'true' : 'false');
    setAttr('bg-color', bg);
    setAttr('load-dimensions', density ? 'true' : 'false');
    setAttr('preset', preset);
  }
);
</script>

<style scoped>
.viewer-wrapper {
  width: 100%;
  max-width: 100%;
  height: 80%;
  position: relative;
}
</style>
