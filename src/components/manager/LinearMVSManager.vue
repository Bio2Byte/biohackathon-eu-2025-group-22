<script setup>
import BaseManager from "./BaseManager.vue";

import SequenceNavigation from "../track_structural/1d_3d/SequenceNavigation.vue";
import LinearTracksManager from "../track_structural/1d_3d/LinearTracksManager.vue";
import SequenceTrack from "../track_structural/1d_3d/SequenceTrack.vue";
import ColouredSequenceTrack from "../track_structural/1d_3d/ColouredSequenceTrack.vue";
import DomainTrack from "../track_structural/1d_3d/DomainTrack.vue";

/**
 * We mirror the BaseManager props and pass them straight through with v-bind="$props".
 * No selection logic here — BaseManager handles it and renders the right pane.
 */
const props = defineProps({
  moleculeId: { type: String, required: true, default: "1CBS" },
  sequence: { type: String, required: true, default: "SEQUENCE" },

  // Forwarded to BaseManager -> MolstarMVSViewer
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
</script>

<template>
  <BaseManager v-bind="$props">
    <template #left>
      <LinearTracksManager>
        <tr>
          <td></td>
          <td>
            <SequenceNavigation :sequence="sequence" :height="40" />
          </td>
        </tr>

        <tr>
          <td>Sequence</td>
          <td>
            <SequenceTrack :sequence="sequence" :height="40" />
          </td>
        </tr>

        <tr>
          <td>Colored</td>
          <td>
            <ColouredSequenceTrack :sequence="sequence" :height="40" />
          </td>
        </tr>

        <tr>
          <td>Domain</td>
          <td>
            <DomainTrack :sequence="sequence" :height="40" />
          </td>
        </tr>
      </LinearTracksManager>
    </template>
  </BaseManager>
</template>

<style scoped>
/* This component defers layout & styling to BaseManager.
   Add local tweaks here only if you need to override something. */
</style>
