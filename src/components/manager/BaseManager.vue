<script setup>
import { ref, computed } from "vue";

import MolstarMVSViewer from "../track_structural/1d_3d/MolstarMVSViewer.vue";

const props = defineProps({
  moleculeId: { type: String, required: true, default: "1CBS" },
  sequence: { type: String, required: true, default: "SEQUENCE" },

  // Forwarded to MolstarMVSViewer
  format: { type: String, default: "bcif" },
  representation: {
    type: String,
    default: "cartoon",
    validator: (v) =>
      [
        "cartoon",
        "backbone",
        "ball_and_stick",
        "line",
        "spacefill",
        "carbohydrate",
        "surface",
      ].includes(v),
  },
  defaultColor: { type: String, default: "#88bb88" },
  colorByResidue: { type: Object, default: () => ({}) },
  viewerOptions: {
    type: Object,
    default: () => ({
      layoutIsExpanded: false,
      layoutShowControls: false,
    }),
  },
});

// Build the PDBe entry-files URL from the provided moleculeId & format
const structureUrl = computed(() => {
  const id = (props.moleculeId || "").toLowerCase().trim();
  const fmt = (props.format || "bcif").toLowerCase().trim();
  const okFmt = ["bcif", "mmcif", "cif", "pdb"].includes(fmt) ? fmt : "bcif";
  return `https://www.ebi.ac.uk/pdbe/entry-files/${id}.${okFmt}`;
});

/* ---------------- Selected residues state + formatter ---------------- */
const selectedResidues = ref([]);

/** Handler for the child's emitted array of residues. */
function handleResidueClick(list) {
  // Expected shape for each item (from your viewer): 
  // { label_asym_id, label_seq_id, label_comp_id } (may also include auth_* fields)
  selectedResidues.value = Array.isArray(list) ? list : [];
}

/** Human-friendly string like "A:42 (LYS), B:10 (GLY)". */
const selectedResiduesText = computed(() => {
  const items = selectedResidues.value;
  if (!items?.length) return "—";
  return items
    .map((r) => {
      const chain = r.label_asym_id ?? r.auth_asym_id ?? "?";
      const pos = r.label_seq_id ?? r.auth_seq_id ?? "?";
      const resn = r.label_comp_id ?? r.auth_comp_id ?? "";
      return `${chain}:${pos}${resn ? ` (${resn})` : ""}`;
    })
    .join(", ");
});
</script>

<template>
  <div>
    <p>
      1D left · 3D right. Click in 1D to select; Scop3P overlay is toggleable. PDB highlights auto-clamped to mapped ranges.
    </p>
    <p>
      <strong>Selected residue(s):</strong> {{ selectedResiduesText }}
    </p>
  </div>

  <div class="grid">
    <div class="left">
        <slot name="left"></slot>
    </div>

    <div class="right">
      <MolstarMVSViewer
        :url="structureUrl"
        :format="format"
        :representation="representation"
        :defaultColor="defaultColor"
        :colorByResidue="colorByResidue"
        :viewerOptions="viewerOptions"
        @residue-click="handleResidueClick"
      />
    </div>
  </div>
</template>

<style scoped>
:root { --panel-height: 560px; }
body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 16px; align-items: stretch; }
.left, .right { height: var(--panel-height); min-height: var(--panel-height); padding: 2em; }
.left { overflow: auto; border-right: 1px solid #e5e7eb; padding-right: 8px; }
.right { display: flex; flex-direction: column; }
.panel { flex: 1 1 auto; display: flex; flex-direction: column; gap: 8px; }
.controls { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
label { font-size: 0.9rem; color: #374151; }
.hint { color: #374151; font-size: 0.9rem; padding: 0 16px; }
.warn { color: #b45309; font-size: 0.85rem; padding: 4px 16px 0; }
table { border-collapse: collapse; width: 100%; }
td { padding: 5px; }
td:first-child { background-color: lightcyan; font: 0.8em sans-serif; white-space: nowrap; }
td:nth-child(2) { background-color: aliceblue; }
tr:nth-child(-n + 3) > td { background-color: transparent; }
.nightingale-structure,
nightingale-structure { display: block; width: 100%; height: 100%; border: 1px solid #e5e7eb; border-radius: 8px; }
.legend { font-size: 12px; color: #374151; margin: 6px 0; }

.flex-container { width: 100%; display: flex; min-height: 300px; }
.flex-item { flex-grow: 1; flex-shrink: 1; width: calc(100% / 2); padding: 1em; }
.left-side { background-color: beige; }
.right-side { background-color: antiquewhite; }
</style>
