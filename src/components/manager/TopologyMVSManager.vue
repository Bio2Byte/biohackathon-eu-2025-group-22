<script setup>
import { computed } from "vue";
import BaseManager from "./BaseManager.vue";
import TopologyViewer from "../track_structural/topology/TopologyViewer.vue";

/**
 * Mirrors BaseManager's props (for the right-side Mol* viewer)
 * and adds a few topology-specific props for the left panel.
 */
const props = defineProps({
  // BaseManager / Mol* pane
  moleculeId: { type: String, required: true, default: "1CBS" },
  sequence: { type: String, required: true, default: "SEQUENCE" },

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

  // Topology-only props (left panel)
  topologyEntityId: { type: [String, Number], default: "1" },
  topologyChainId: { type: String, default: "" }, // optional, best chain picked if empty
  topologyWidth: { type: [String, Number], default: "100%" },
  topologyHeight: { type: [String, Number], default: 360 },
  topologySubscribeEvents: { type: [Boolean, String], default: true },
  topologyDisplayStyle: { type: String, default: "" },
  topologyErrorStyle: { type: String, default: "" },
});

// Map moleculeId -> entryId (lowercase)
const entryId = computed(() => (props.moleculeId || "").toLowerCase().trim());
const topoWidth = computed(() =>
  typeof props.topologyWidth === "number" ? `${props.topologyWidth}px` : props.topologyWidth
);
const topoHeight = computed(() =>
  typeof props.topologyHeight === "number" ? `${props.topologyHeight}px` : props.topologyHeight
);
</script>

<template>
  <BaseManager v-bind="$props">
    <template #left>
      <TopologyViewer
        :entry-id="entryId"
        :entity-id="topologyEntityId"
        :chain-id="topologyChainId || undefined"
        :width="topoWidth"
        :height="topoHeight"
        :subscribe-events="topologySubscribeEvents"
        :display-style="topologyDisplayStyle || undefined"
        :error-style="topologyErrorStyle || undefined"
      />
    </template>
  </BaseManager>
</template>

<style scoped>
/* Styling/layout is handled by BaseManager + TopologyViewer. */
</style>
