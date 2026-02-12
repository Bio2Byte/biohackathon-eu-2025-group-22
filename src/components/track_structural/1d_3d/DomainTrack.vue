<script setup>
    import { ref, onMounted } from 'vue';
    import '@nightingale-elements/nightingale-track';  // Import defines the custom element
    
    const props = defineProps({
        height: { type: Number, required: false },
	      length: { type: Number, required: false },
	      displayStart: { type: Number, required: false },
	      displayEnd: { type: Number, required: false },
	      marginColor: { type: String, required: false },
        displayLabels: { type: Boolean, default: false },
        highlightEvent: { type: String, required: false },
        highlightColor: { type: String, required: false },
        minWidth: { type: Number, required: false },
        minHeight: { type: Number, required: false },
        domains: {
          type: Array,
          default: ()=> [],
          required: false
        }
    });

    const trackEl = ref(null);  
    onMounted(() => {
        if (trackEl.value) {
          trackEl.value.data = props.domains.map(d => ({
            start: d.start,
            end: d.end,
            color: d.color || "blue",
            label: d.label || "LABEL",
          }));
	}
    });
</script>

<template>
    <nightingale-track
        ref="trackEl"
        :id="props.id"
        :height="props.height"
        :length="props.length"
        :display-start="props.displayStart"
        :display-end="props.displayEnd"
        :margin-color="props.marginColor"
        :display-labels="props.displayLabels"
        :highlight-event="props.highlightEvent"
        :highlight-color="props.highlightColor"
        :min-width="props.minWidth"
        :min-height="props.minHeight"

    />
</template>

<style scoped></style>
