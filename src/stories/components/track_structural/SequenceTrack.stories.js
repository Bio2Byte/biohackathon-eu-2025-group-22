import SequenceTrack from "@/components/track_structural/1d_3d/SequenceTrack.vue";


export default {
  title: 'Tracks/Structural/SequenceTrack',
  component: SequenceTrack,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    sequence: {
      label: "Protein Sequence",
      description: 'The SEQUENCE text to display'
    },
    height: {
      label: "Track height",
      description: "Track height"
    }
  }
};

/**
 * Primary template with red background
 */
export const Sequence = {
  args: {
    sequence: 'SEQUENCESEQUENCESEQUENCESEQUENCE',
    height: 40
  }
};
