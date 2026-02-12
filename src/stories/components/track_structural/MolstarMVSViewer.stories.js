// src/stories/MolstarMVSViewer.stories.js
import MolstarMVSViewer from '@/components/track_structural/1d_3d/MolstarMVSViewer.vue';
import { reactive, ref, onMounted } from 'vue';

export default {
  title: 'Tracks/Structural/MolstarMVSViewer',
  component: MolstarMVSViewer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Mol* viewer using Method 2 (builder). Pass a structure `url`; the builder logic stays constant. `representation` controls the polymer representation. `defaultColor` and `colorByResidue` drive the coloring. Emits `residueClick` events containing arrays of selected residues.',
      },
    },
  },
  argTypes: {
    url: {
      control: 'text',
      description: 'URL of structure file (bcif/mmcif/pdb/gz)',
      table: { category: 'Data' },
    },
    format: {
      control: { type: 'select' },
      options: ['bcif', 'mmcif', 'cif', 'pdb'],
      description: 'Explicit format for parsing the structure',
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
      description: 'Polymer representation used by the builder',
      table: { category: 'Style' },
    },
    defaultColor: {
      control: 'color',
      description: 'Default polymer color (applied first)',
      table: { category: 'Color' },
    },
    colorByResidue: {
      control: 'object',
      description:
        'Overrides per residue. Keys: "A:42" (label_asym_id + label_seq_id) or "auth:B:100" (auth_asym_id + auth_seq_id). Values: CSS color strings.',
      table: { category: 'Color' },
    },
    viewerOptions: {
      control: 'object',
      description: 'Options forwarded to molstar.Viewer.create',
      table: { category: 'Viewer' },
    },
  },
};

const viewerBox = `
  width: 640px;
  height: 480px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: white;
`;

function renderWithSelectionLogger(args) {
  return {
    components: { MolstarMVSViewer },
    setup() {
      const lastSelection = ref([]);

      const handleResidueClick = (residues) => {
        console.log('[Storybook] Residue selection:', residues);
        lastSelection.value = residues;
      };

      return { args, lastSelection, handleResidueClick };
    },
    template: `
      <div>
        <div style="${viewerBox}">
          <MolstarMVSViewer
            v-bind="args"
            @residue-click="handleResidueClick"
          />
        </div>
        <div
          style="font-family: monospace; font-size: 13px; margin-top: 12px; background: #f9fafb; padding: 8px; border-radius: 6px;"
        >
          <strong>Selection:</strong>
          <pre style="white-space: pre-wrap; word-break: break-all; margin: 4px 0 0;">
            {{ JSON.stringify(lastSelection, null, 2) }}
          </pre>
        </div>
      </div>
    `,
  };
}

export const Basic = renderWithSelectionLogger.bind({});
Basic.args = {
  url: 'https://www.ebi.ac.uk/pdbe/entry-files/1cbs.bcif',
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
};
Basic.parameters = {
  docs: {
    description: {
      story:
        'Loads a BCIF structure with per-residue coloring. Click on residues to see emitted selection payloads below the viewer and in the console.',
    },
  },
};

export const MMCIF = renderWithSelectionLogger.bind({});
MMCIF.args = {
  url: 'https://files.rcsb.org/download/1CRN.cif',
  format: 'mmcif',
  representation: 'backbone',
  defaultColor: '#4a90e2',
  colorByResidue: {
    'auth:B:100': 'tomato',
  },
  viewerOptions: {
    layoutIsExpanded: false,
    layoutShowControls: false,
  },
};
MMCIF.parameters = {
  docs: {
    description: {
      story:
        'mmCIF input with backbone representation and an auth-based residue selector override. Selection events appear live below the viewer.',
    },
  },
};

export const ReplaceUrlRepresentationAndColors = () => ({
  components: { MolstarMVSViewer },
  setup() {
    const args = reactive({
      url: 'https://www.ebi.ac.uk/pdbe/entry-files/1cbs.bcif',
      format: 'bcif',
      representation: 'cartoon',
      defaultColor: '#66aa66',
      colorByResidue: {
        'A:42': '#cc3399',
      },
      viewerOptions: {
        layoutIsExpanded: false,
        layoutShowControls: false,
      },
    });

    const lastSelection = ref([]);

    const handleResidueClick = (residues) => {
      console.log('[Storybook] Residue selection:', residues);
      lastSelection.value = residues;
    };

    onMounted(() => {
      setTimeout(() => {
        args.url = 'https://files.rcsb.org/download/1CRN.cif';
        args.format = 'mmcif';
        args.representation = 'surface';
        args.defaultColor = '#888888';
        args.colorByResidue = {
          'auth:B:10': '#ffcc00',
          'auth:B:25': '#3366ff',
        };
      }, 2500);

      setTimeout(() => {
        args.representation = 'ball_and_stick';
        args.defaultColor = '#99ccee';
        args.colorByResidue = {
          'auth:B:10': '#ff6666',
          'auth:B:25': '#33cc99',
          'auth:B:46': '#aa66ff',
        };
      }, 5000);
    });

    return { args, lastSelection, handleResidueClick };
  },
  template: `
    <div>
      <p style="font: 14px/1.4 sans-serif; margin: 0 0 8px;">
        Swaps structure and representation dynamically. Selection output updates live.
      </p>
      <div style="${viewerBox}">
        <MolstarMVSViewer v-bind="args" @residue-click="handleResidueClick" />
      </div>
      <div
        style="font-family: monospace; font-size: 13px; margin-top: 12px; background: #f9fafb; padding: 8px; border-radius: 6px;"
      >
        <strong>Selection:</strong>
        <pre style="white-space: pre-wrap; word-break: break-all; margin: 4px 0 0;">
          {{ JSON.stringify(lastSelection, null, 2) }}
        </pre>
      </div>
    </div>
  `,
});
ReplaceUrlRepresentationAndColors.parameters = {
  docs: {
    description: {
      story:
        'Demonstrates reactive rebuilds when props change and shows live residue selection output below the viewer and in the console.',
    },
  },
};
