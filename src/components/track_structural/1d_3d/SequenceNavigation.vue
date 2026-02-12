<script setup>
    import { computed, ref, watchEffect } from 'vue';
    import '@nightingale-elements/nightingale-navigation';

    const props = defineProps({
        sequence: { type: String, required: true },
        height: { type: Number, default: 40 },
    });

    const navEl = ref(null);

    const height = computed(() => props.height ?? 40);
    const sequenceLength = computed(() => (props.sequence ? props.sequence.length : 0));
    const displayStart = 1; // inclusive start
    const displayEnd = computed(() => Math.max(1, sequenceLength.value)); // inclusive end

    watchEffect(() => {
        const el = navEl.value;
        if (!el) return;

        // Set DOM **properties** (not attributes) so the custom element reacts.
        el.length = sequenceLength.value;
        el.displayStart = displayStart;
        el.displayEnd = displayEnd.value;
        el.height = height.value;
    });
</script>

<template>
    <nightingale-navigation
        ref="navEl"
        id="navigation"
        min-width="300"
        margin-color="white"
    />
</template>
