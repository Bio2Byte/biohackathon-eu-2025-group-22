<script setup>
    import { ref, onMounted } from 'vue';
    import '@nightingale-elements/nightingale-sequence';  // Import defines the custom element
    
    const props = defineProps({
        sequence: { type: String, required: true },
        height: { type: Number, required: false }
    })
    
    const seqEl = ref(null);
    onMounted(async () => {
        if (seqEl.value) {
            // Nightingale expects the 'data' property
            console.log("Before: ", seqEl.value.data)
            seqEl.value.data = props.sequence;
            console.log("After: ", seqEl.value.data)   
        }
    });
</script>

<template>
    <h1>Example track for {{ props.sequence.length }} AA using {{ props.height }} pixels</h1>
    <nightingale-sequence
        ref="seqEl"
        :sequence="props.sequence"
        width="400"
        :height="props.height"
        length="32"
        display-start="1"
        :display-end="props.sequence.length"
    />
    <p>
        End of the story.
    </p>
</template>

<style scoped></style>
