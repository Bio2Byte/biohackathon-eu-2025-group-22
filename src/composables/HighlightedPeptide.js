import { ref, reactive } from 'vue'

// peptide [start, end]
const chosenPeptide = reactive([0,0])

export const setHighlightedPeptideService = () => {
    function setPeptide(peptide) {
        console.log('chosen peptide', peptide)
        chosenPeptide[0] = peptide.peptide_start
        chosenPeptide[1] = peptide.peptide_end
    }

    return {
        chosenPeptide,
        setPeptide
    }
}