<script setup>
import Peptides from '../peptides/Peptides.vue'
import SequenceOnly from './SequenceOnly.vue'
import * as sequence from '../../../../data/track_linear/fasta_sequence.json'
import * as peptidesArray from '../../../../data/track_graphs/peptides.json'


</script>

<template>
  <h1>ELIXIR Bio-Hackathon Berlin 2025 - Group 22</h1>
  <h2>Track: Linear</h2>
  <h3>Stacked visual component</h3>
  <div>
    <Peptides v-bind:peptides="peptidesArray.peptides" v-bind:sequence="sequence.sequence"></Peptides>
    <SequenceOnly v-bind:sequence="sequence.sequence"></SequenceOnly>
  </div>
</template>

<style scoped></style>
