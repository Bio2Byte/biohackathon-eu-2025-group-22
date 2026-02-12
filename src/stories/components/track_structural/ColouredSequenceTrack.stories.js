// src/stories/ColouredSequenceTrack.stories.js
import ColouredSequenceTrack from '@/components/track_structural/1d_3d/ColouredSequenceTrack.vue';

const KNOWN_SCHEMES = [
  // Commonly used in practice; you can extend this as you add support
  'hydrophobicity-scale',
  'isoelectric-point',
];

export default {
  title: 'Tracks/Structural/ColouredSequenceTrack',
  component: ColouredSequenceTrack,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**ColouredSequenceTrack** wraps \`<nightingale-colored-sequence>\`.
Pass the protein **sequence**, the **height**, and a **scale** (mapped to the web component's \`scheme\`).

**Known scheme strings** (non-exhaustive):
- \`${KNOWN_SCHEMES.join('`, `')}\`

You can also type any valid scheme identifier your deployment supports.
        `,
      },
    },
  },
  argTypes: {
    sequence: {
      control: 'text',
      description: 'Protein sequence to display',
      table: { category: 'Data' },
    },
    height: {
      control: { type: 'number', min: 10, step: 1 },
      description: 'Track height in pixels',
      table: { category: 'Layout' },
    },
    scheme: {
      control: 'text', // keep flexible; show presets below
      description:
        'Coloring scheme identifier (mapped to the web component `scheme` property)',
      table: { category: 'Style' },
    },
  },
};

/** Render helper: syncs the "preset" dropdown into the "scheme" arg */
const Template = (args, { argTypes }) => ({
  components: { ColouredSequenceTrack },
  props: Object.keys(argTypes),
  watch: {
    preset(newVal) {
      if (newVal) this.scheme = newVal;
    },
  },
  template: `
    <div style="width: 720px; padding: 12px; background:#fafafa; border:1px solid #eee; border-radius:8px;">
      <ColouredSequenceTrack v-bind="$props" />
    </div>
  `,
});

/** Primary story */
export const Track = Template.bind({});
Track.args = {
  sequence: 'SEQUENCESEQUENCESEQUENCESEQUENCE',
  height: 40,
  scheme: 'hydrophobicity-scale',
};
Track.parameters = {
  docs: {
    description: {
      story:
        'Displays the sequence with the **hydrophobicity-scale** coloring by default. Use the scheme dropdown or type a custom `scale` string.',
    },
  },
};
