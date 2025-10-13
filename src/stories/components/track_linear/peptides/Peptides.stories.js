import Peptides from '@/components/track_linear/peptides/Peptides.vue'
import * as sequence from '../../../../../data/track_linear/fasta_sequence.json'
import * as peptidesArray from '../../../../../data/track_graphs/peptides.json'


export default {
  title: 'Tracks/Linear/Peptides',
  component: Peptides,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    color: {
      control: {
        type: 'select',
        labels: {
          '#f00': 'Red',
          '#0f0': 'Green',
          '#00f': 'Blue',
          '#ff0': 'Yellow',
          '#f0f': 'Magenta',
          '#0ff': 'Cyan'
        }
      },
      options: ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '#f00' }
      },
      description: 'Background color of the component'
    },
    title: {
      control: 'select',
      options: ['Primary Title', 'Secondary Title', 'Tertiary Title'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Primary Title' }
      },
      description: 'The title text to display'
    }
  }
};

/**
 * Primary template with red background
 */
export const Primary = {
  render: (args) => ({
    components: { Peptides },
    setup() {
      return { args };
    },
    template: '<Peptides v-bind="args" />',
  }),
  args: {
    sequence: sequence.sequence,
    peptides: peptidesArray.peptides
  }
};

/**
 * Secondary template with green background
 */
export const Secondary = {
  args: {
    title: 'Secondary Title',
    color: '#0f0'
  }
};

/**
 * Tertiary template with blue background
 */
export const Tertiary = {
  args: {
    title: 'Tertiary Title',
    color: '#00f'
  }
};
