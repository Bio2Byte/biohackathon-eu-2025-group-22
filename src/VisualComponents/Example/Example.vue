<script setup>
  import { ref } from 'vue'

  defineProps(['title', 'color'])

  const count = ref(0)
</script>

<template>
  <div class="example-container" :style="{ backgroundColor: color }">
    <h1>{{ title }}</h1>
    <button @click="count++">You clicked me {{ count }} times.</button>
    <p>
      Visit us <a href="https://compomics.com/" target="_blank" rel="noopener">CompOmics</a> and
      <a href="https://bio2byte.be/" target="_blank" rel="noopener">Bio2Byte</a>
    </p>
  </div>
</template>

<style scoped>
  .example-container {
    padding: 1em 2em;
    border: 1px solid gray;
    border-radius: 1em;
    font-size: 14px;
    font-weight: 500;
    text-align: center;;
  }
</style>
