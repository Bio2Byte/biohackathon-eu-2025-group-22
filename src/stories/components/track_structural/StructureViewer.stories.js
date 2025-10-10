import StructureViewer from "@/components/track_structural/1d_3d/StructureViewer.vue";


export default {
  title: 'Tracks/Structural/StructureViewer',
  component: StructureViewer,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    moleculeId: {}
  }
};

/**
 * Primary template with red background
 */
export const Primary = {
  args: {
    moleculeId: '1CBS',
  }
};
