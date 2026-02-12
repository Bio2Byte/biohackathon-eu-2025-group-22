<template>
  <nightingale-colored-sequence
    id="colored-sequence"
    ref="seqEl"
    min-width="400"
    margin-color="white"
  />
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import '@nightingale-elements/nightingale-colored-sequence'; // defines the custom element

const props = defineProps({
  sequence: { type: String, required: true },
  height: { type: Number, default: 40 },
  // Valid examples include: "hydrophobicity-scale", "isoelectric-point", etc.
  scheme: { type: String, default: 'hydrophobicity-scale' },
});

const seqEl = ref(null);

const compHeight = computed(() => props.height ?? 40);
const compScheme = computed(() => props.scheme ?? 'hydrophobicity-scale');
const sequenceLength = computed(() => (props.sequence ? props.sequence.length : 0));
const displayStart = 1; // inclusive
const displayEnd = computed(() => Math.max(1, sequenceLength.value)); // inclusive

watchEffect(() => {
  const el = seqEl.value;
  if (!el) return;

  // Set DOM **properties** so the custom element reacts.
  // Provide the sequence string; the element can derive length internally,
  // but it's fine to also pass length/display window explicitly.
  el.sequence = props.sequence;
  el.length = sequenceLength.value;

  el.displayStart = displayStart;
  el.displayEnd = displayEnd.value;

  el.height = compHeight.value;

  el.scheme = compScheme.value;
});
</script>

<style scoped>
</style>
