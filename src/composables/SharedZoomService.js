import {ref, reactive} from 'vue'

const lastUpdater = ref(null)
const sharedZoom = reactive([0, 0])
const finalDomain = reactive([0, 0])

export const useSharedZoomService = () => {
    console.log('useSharedZoomService called')

    function updateZone(zone, emitter) {
        console.log('updateZone called with zone:', zone, 'emitter:', emitter)
        if (emitter) {
            lastUpdater.value = emitter.value
            sharedZoom[0] = zone[0]
            sharedZoom[1] = zone[1]
        }
    }

    /**
     * Sets the final domain based on the shared zoom.
     * This function is useful to get the final region when zooming is done.
     */
    function finalDomainSetter() {
        console.log('finalDomainSetter called')
        finalDomain[0] = sharedZoom[0]
        finalDomain[1] = sharedZoom[1]
        // console.log('finalDomain set to:', finalDomain)
    }
    return {
        sharedZoom,
        finalDomain,
        lastUpdater,
        finalDomainSetter,
        updateZone
    }
}
