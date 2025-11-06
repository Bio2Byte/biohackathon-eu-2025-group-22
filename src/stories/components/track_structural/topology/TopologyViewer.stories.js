// Storybook story for Topology.vue (Vue 3, JS)
import TopologyViewer from "@/components/track_structural/topology/TopologyViewer.vue";

export default {
  title: 'Tracks/Structural/TopologyViewer',
  component: TopologyViewer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'PDBe PDB Topology Viewer web component wrapped in Vue. Requires `entryId` (PDB ID) and `entityId`. Optional `chainId`, `displayStyle`, `errorStyle`, `subscribeEvents`.',
      },
    },
  },
  argTypes: {
    entryId: {
      control: 'text',
      description: 'PDB entry ID (e.g., "1cbs")',
      table: { category: 'Data' },
    },
    entityId: {
      control: 'text',
      description: 'Entity ID within the PDB entry (e.g., "1")',
      table: { category: 'Data' },
    },
    chainId: {
      control: 'text',
      description: 'Chain ID (optional; best chain auto-selected when omitted)',
      table: { category: 'Data' },
    },
    displayStyle: {
      control: 'text',
      description: 'CSS applied to the display box (e.g., "border:1px solid #ff0000")',
      table: { category: 'Style' },
    },
    errorStyle: {
      control: 'text',
      description: 'CSS applied to the error box (e.g., "color:#ff0000")',
      table: { category: 'Style' },
    },
    subscribeEvents: {
      control: { type: 'boolean' },
      description: 'Enable PDBe cross-component event wiring',
      table: { category: 'Behavior' },
    },
    width: {
      control: 'text',
      description: 'Wrapper width (e.g., "640px" or number)',
      table: { category: 'Layout' },
    },
    height: {
      control: 'text',
      description: 'Wrapper height (e.g., "360px" or number)',
      table: { category: 'Layout' },
    },
  },
};

const boxStyle = 'border:1px dashed #ddd; padding:8px; border-radius:8px; background:#fafafa;';

/** Helper renderer */
const renderWithBox = (args) => ({
  components: { TopologyViewer },
  setup() {
    return { args };
  },
  template: `
    <div style="${boxStyle}">
      <TopologyViewer v-bind="args" />
    </div>
  `,
});

export const Basic = renderWithBox.bind({});
Basic.args = {
  entryId: '1cbs',
  entityId: '1',
  chainId: 'A',
  subscribeEvents: true,
  width: '700px',
  height: '420px',
  displayStyle: '',
  errorStyle: '',
};
Basic.parameters = {
  docs: {
    description: {
      story: 'Renders the topology for PDB **1CBS**, entity **1**, chain **A**. Toggle controls to try other entries/chains.',
    },
  },
};

export const WithoutChain = renderWithBox.bind({});
WithoutChain.args = {
  entryId: '1cbs',
  entityId: '1',
  chainId: '',
  subscribeEvents: true,
  width: '700px',
  height: '420px',
};
WithoutChain.parameters = {
  docs: {
    description: {
      story:
        'Omits `chainId`; the viewer will select the best chain automatically, as per the component documentation.',
    },
  },
};

export const StyledBox = renderWithBox.bind({});
StyledBox.args = {
  entryId: '1cbs',
  entityId: '1',
  chainId: 'A',
  displayStyle: 'border:2px solid #4f46e5; border-radius:6px;',
  errorStyle: 'color:#b91c1c;',
  width: '700px',
  height: '420px',
};
StyledBox.parameters = {
  docs: {
    description: {
      story:
        'Demonstrates `displayStyle` and `errorStyle` attributes wired through the Vue wrapper.',
    },
  },
};
