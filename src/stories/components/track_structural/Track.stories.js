import Track from "@/components/track_structural/1d_3d/Track.vue";


export default {
  title: 'Tracks/Structural/Track',
  component: Track,
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
export const Single = {
  args: {
    sequence: 'SEQUENCESEQUENCESEQUENCESEQUENCE',
    height: 40
  }
};
