import Network from '@/components/track_graphs/network/Network.vue';
import ProteinNetwork from 'vue-protein-network-visualizer';
import edgesData from '../../../../../data/track_graphs/protein_data.json';
import residueData from '../../../../../data/track_graphs/residue_data.json';

function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t |= 0; t = (t + 0x6D2B79F5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function palette(i) {
  const colors = ['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd',
                  '#8c564b','#e377c2','#7f7f7f','#bcbd22','#17becf'];
  return colors[i % colors.length];
}

function generateGraph(N, M, rng) {
  const nodes = [];
  for (let i = 0; i < N; i++) {
    const x = rng() * 2 - 1;
    const y = rng() * 2 - 1;
    nodes.push({
      id: String(i + 1),
      label: `Node ${i + 1}`,
      x,
      y,
      size: 6 + Math.floor(rng() * 10),
      color: palette(i),
    });
  }

  const maxEdges = (N * (N - 1)) / 2;
  const target = Math.min(M, maxEdges);
  const edgeSet = new Set();
  const edges = [];

  const keyOf = (a, b) => {
    const A = Math.min(a, b);
    const B = Math.max(a, b);
    return `${A}->${B}`;
  };

  let attempts = 0;
  const maxAttempts = target * 10 + 100;

  while (edges.length < target && attempts < maxAttempts) {
    attempts++;
    if (N < 2) break;
    const ai = Math.floor(rng() * N);
    let bi = Math.floor(rng() * N);
    if (ai === bi) continue; // no self-loops
    const a = String(ai + 1);
    const b = String(bi + 1);
    const k = keyOf(a, b);
    if (edgeSet.has(k)) continue;
    edgeSet.add(k);
    edges.push({
      // omit id -> Network.vue will generate a stable key `${source}->${target}`
      source: a,
      target: b,
      size: 1 + Math.floor(rng() * 4),
      color: '#999',
    });
  }

  return { nodes, edges };
}

export default {
  title: 'Tracks/Graphs/Network',
  component: Network,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    width: { control: 'number' },
    height: { control: 'number' },
    sigmaSettings: { control: 'object' },
  },
};

/**
 * Template function to instantiate the component with args
 */
const Template = (args) => ({
  components: { Network },
  setup() {
    return { args };
  },
  template: `
    <Network v-bind="args"
             @nodeClick="(e) => console.log('Node clicked:', e.node)"
             @edgeClick="(e) => console.log('Edge clicked:', e.edge)"
             @stageClick="() => console.log('Background clicked')" />
  `,
});

// Template for ProteinNetwork component
const ProteinTemplate = (args) => ({
  components: { ProteinNetwork },
  setup() {
    return { args };
  },
  template: `
    <ProteinNetwork
      v-bind="args"
      @node-click="(node) => console.log('Protein node clicked:', node)"
      @node-hover="(node) => console.log('Protein node hovered:', edgesData)"
      @node-select="(node) => console.log('Protein node selected:', node)"
      @node-deselect="(node) => console.log('Protein node deselected:', node)"
    />
  `,
});

/**
 * Example story: minimal 2-node graph
 */
export const Basic = Template.bind({});
Basic.args = {
  width: 800,
  height: 400,
  sigmaSettings: {
    renderLabels: true,
    labelDensity: 1.0,
  },
  nodes: [
    { id: '1', label: 'Node 1', x: 0, y: 0, size: 10, color: 'blue' },
    { id: '2', label: 'Node 2', x: 1, y: 1, size: 20, color: 'red' },
  ],
  edges: [
    { source: '1', target: '2', size: 5, color: 'purple' },
  ],
};

/**
 * A second example: more complex network
 */
export const MultiNode = Template.bind({});
MultiNode.args = {
  width: 800,
  height: 500,
  sigmaSettings: { renderLabels: true },
  nodes: [
    { id: '1', label: 'Alpha', x: 0, y: 0, size: 10, color: '#007bff' },
    { id: '2', label: 'Beta', x: 1, y: 0, size: 12, color: '#ff4136' },
    { id: '3', label: 'Gamma', x: 0, y: 1, size: 8, color: '#2ecc40' },
    { id: '4', label: 'Delta', x: 1, y: 1, size: 14, color: '#ff851b' },
  ],
  edges: [
    { source: '1', target: '2', color: '#999', size: 2 },
    { source: '1', target: '3', color: '#999', size: 2 },
    { source: '2', target: '4', color: '#999', size: 2 },
    { source: '3', target: '4', color: '#999', size: 2 },
  ],
};

/**
 * Protein Network Stories
 */
// Story using test data
export const ProteinBasic = ProteinTemplate.bind({});
ProteinBasic.args = {
  width: 800,
  height: 600,
  distanceThreshold: 8,
  background: '#fafafa',
  edgeData: [
    { res1: 1, res2: 2, distance: 3.8 },
    { res1: 2, res2: 3, distance: 4.2 },
    { res1: 3, res2: 4, distance: 5.1 },
    { res1: 4, res2: 5, distance: 3.9 },
    { res1: 5, res2: 1, distance: 6.2 },
  ],
  nodeData: [
    { Residue: 1, CombinedScore: 9.5, Degree: 3, pLDDT: 95.2, Resname: 'ALA' },
    { Residue: 2, CombinedScore: 7.2, Degree: 3, pLDDT: 89.1, Resname: 'LEU' },
    { Residue: 3, CombinedScore: 8.8, Degree: 2, pLDDT: 92.4, Resname: 'VAL' },
    { Residue: 4, CombinedScore: 6.1, Degree: 2, pLDDT: 78.3, Resname: 'SER' },
    { Residue: 5, CombinedScore: 5.3, Degree: 2, pLDDT: 82.7, Resname: 'THR' },
  ],
};

// Story that uses your actual JSON files
export const ProteinRealData = ProteinTemplate.bind({});
ProteinRealData.args = {
  width: 1000,
  height: 700,
  distanceThreshold: 8,
  background: '#ffffff',
  edgeData: [
   ...edgesData,
  ],
  nodeData: [
    ...residueData,
  ],
};

// Dynamic story that can load different datasets
export const ProteinDynamic = (args) => {
  return {
    components: { ProteinNetwork },
    setup() {
      const loadData = async () => {
        try {
          alert('Dynamically loaded data');
          const edgeData = edgesData;
          const nodeData = residueData;

          return {
            edgeData:edgeData,
            nodeData:nodeData
          };
        } catch (error) {
          console.error('Failed to load protein data:', error);
          return { edgeData: [], nodeData: [] };
        }
      };

      return {
        args,
        loadData
      };
    },
    template: `
      <div>
        <ProteinNetwork
          v-bind="args"
          @node-click="(node) => console.log('Protein node clicked:', node)"
          @node-hover="(node) => console.log('edgesData:', node)"
        />
      </div>
    `,
  };
};

ProteinDynamic.args = {
  width: 1000,
  height: 700,
  distanceThreshold: 8,
};
/**
 * TODO: Arrange networks
 */
export const Arranging = (args) => {
  const seed = Number.isFinite(args.seed) ? args.seed : Date.now();
  const rng = mulberry32(seed);
  const N = Number.isFinite(args.N) ? args.N : 100;
  const M = Number.isFinite(args.M) ? args.M : 150;
  const { nodes, edges } = generateGraph(N, M, rng);

  return {
    components: { Network },
    setup() {
      return {
        args: {
          ...args,
          nodes,
          edges,
        },
      };
    },
    template: `
      <Network v-bind="args"
               @nodeClick="(e) => console.log('Node clicked:', e.node)"
               @edgeClick="(e) => console.log('Edge clicked:', e.edge)"
               @stageClick="() => console.log('Background clicked')" />
    `,
  };
};

Arranging.args = {
  width: 800,
  height: 500,
  sigmaSettings: { renderLabels: true },
  // Controls for generation:
  N: 100,
  M: 300,
  seed: 1,
  // These will be overwritten by the generator:
  nodes: [],
  edges: [],
};
