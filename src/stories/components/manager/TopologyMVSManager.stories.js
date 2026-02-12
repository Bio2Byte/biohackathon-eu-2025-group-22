import TopologyMVSManager from '@/components/manager/TopologyMVSManager.vue';
import { reactive, onMounted } from 'vue';

export default {
  title: 'Manager/TopologyMVSManager',
  component: TopologyMVSManager,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'BaseManager with PDBe Topology Viewer in the left slot and Mol* (MVS) on the right. Control topology (entry/entity/chain) independently of the 3D representation and colors.',
      },
    },
  },
  argTypes: {
    // Core data
    moleculeId: {
      control: 'text',
      description: 'PDB/PDBe entry ID (mapped to TopologyViewer.entryId, lowercased).',
      table: { category: 'Data' },
    },
    sequence: {
      control: 'text',
      description: 'Protein sequence used in other linear tracks (retained by BaseManager).',
      table: { category: 'Data' },
    },

    // 3D (Mol*) pane
    format: {
      control: { type: 'select' },
      options: ['bcif', 'mmcif', 'cif', 'pdb'],
      description: 'Parsing format for the 3D viewer.',
      table: { category: '3D Viewer' },
    },
    representation: {
      control: { type: 'select' },
      options: [
        'cartoon',
        'backbone',
        'ball_and_stick',
        'line',
        'spacefill',
        'carbohydrate',
        'surface',
      ],
      description: 'Polymer representation in the 3D viewer.',
      table: { category: '3D Viewer' },
    },
    defaultColor: {
      control: 'color',
      description: 'Default polymer color applied first.',
      table: { category: '3D Viewer' },
    },
    colorByResidue: {
      control: 'object',
      description:
        'Per-residue color overrides (e.g., { "A:42": "#cc3399", "auth:B:100": "tomato" }).',
      table: { category: '3D Viewer' },
    },
    viewerOptions: {
      control: 'object',
      description: 'Options passed to Mol* Viewer.',
      table: { category: '3D Viewer' },
    },

    // Topology (left) pane
    topologyEntityId: {
      control: 'text',
      description: 'Topology entity ID (e.g., "1").',
      table: { category: 'Topology' },
    },
    topologyChainId: {
      control: 'text',
      description: 'Optional topology chain ID (e.g., "A"). Leave empty to auto-pick.',
      table: { category: 'Topology' },
    },
    topologyWidth: {
      control: 'text',
      description: 'Width for the topology wrapper (e.g., "100%" or "720px").',
      table: { category: 'Topology' },
    },
    topologyHeight: {
      control: 'number',
      description: 'Height for the topology wrapper in px.',
      table: { category: 'Topology' },
    },
    topologySubscribeEvents: {
      control: 'boolean',
      description: 'Pass through subscribe-events to the web component.',
      table: { category: 'Topology' },
    },
    topologyDisplayStyle: {
      control: 'text',
      description: 'Custom CSS string for display-style.',
      table: { category: 'Topology' },
    },
    topologyErrorStyle: {
      control: 'text',
      description: 'Custom CSS string for error-style.',
      table: { category: 'Topology' },
    },
  },
};

const containerStyle = 'width: 960px;';

const Template = (args) => ({
  components: { TopologyMVSManager },
  setup() {
    return { args };
  },
  template: `
    <div style="${containerStyle}">
      <TopologyMVSManager v-bind="args" />
    </div>
  `,
});

export const Basic = Template.bind({});
Basic.args = {
  // Core
  moleculeId: '1CBS',
  sequence: 'SEQUENCEEXAMPLEBIOHACKATHONBERLIN',
  // 3D
  format: 'bcif',
  representation: 'cartoon',
  defaultColor: '#66aa66',
  colorByResidue: {
    'A:42': '#cc3399',
    'A:57': '#ff9900',
  },
  viewerOptions: {
    layoutIsExpanded: false,
    layoutShowControls: false,
  },
  // Topology
  topologyEntityId: '1',
  topologyChainId: 'A',
  topologyWidth: '100%',
  topologyHeight: 360,
  topologySubscribeEvents: true,
};
