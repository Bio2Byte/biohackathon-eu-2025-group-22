// src/stories/Manager.stories.js
import LinearMVSManager from '@/components/manager/LinearMVSManager.vue';
import { reactive, onMounted } from 'vue';

export default {
  title: 'Manager/LinearMVSManager',
  component: LinearMVSManager,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Wrapper around MolstarMVSViewer + BaseManager. Controls 3D representation, default color, and per-residue overrides (colorByResidue). Left pane is the linear tracks.',
      },
    },
  },
  argTypes: {
    moleculeId: {
      control: 'text',
      description:
        'PDB/PDBe molecule identifier used to resolve the structure URL (e.g., "1CBS").',
      table: { category: 'Data' },
    },
    sequence: {
      control: 'text',
      description:
        'Protein sequence shown in the linear tracks (left pane).',
      table: { category: 'Data' },
    },
    format: {
      control: { type: 'select' },
      options: ['bcif', 'mmcif', 'cif', 'pdb'],
      description: 'Parsing format forwarded to the 3D viewer.',
      table: { category: 'Data' },
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
      description: 'Polymer representation used in the 3D viewer.',
      table: { category: 'Style' },
    },
    defaultColor: {
      control: 'color',
      description: 'Default polymer color (applied first).',
      table: { category: 'Color' },
    },
    colorByResidue: {
      control: 'object',
      description:
        'Per-residue color overrides (e.g., { "A:42": "#cc3399", "auth:B:100": "tomato" }).',
      table: { category: 'Color' },
    },
    viewerOptions: {
      control: 'object',
      description: 'Options forwarded to the Mol* Viewer constructor.',
      table: { category: 'Viewer' },
    },
  },
};

/**
 * Primary example with defaults and a couple of residue overrides.
 */
export const Basic = {
  args: {
    moleculeId: '1CBS',
    sequence: 'SEQUENCEEXAMPLEBIOHACKATHONBERLIN',
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
  },
};
