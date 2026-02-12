import DomainTrack from "@/components/track_structural/1d_3d/DomainTrack.vue";


export default {
  title: 'Tracks/Structural/DomainTrack',
  component: DomainTrack,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    height: {
      label: "Track height",
      description: "Height"
    },
    length: {
      label: "Track length",
      description: "Length"
    },
    displayStart: {
      label: "Display start",
      description: "Start"
    },
    displayEnd: {
      label: "Display end",
      description: "End"
    },
    marginColor: {
      label: "Margin color",
      description: "margin color"
    },
    displayLabels: {
      label: "Show labels",
      description: "labels"
    },
    highlightEvent: {
      label: "Highlight event",
      description: "highlightEvent"
    },
    highlightColor: {
      label: "Highlight event",
      description: "highlight color"
    },
    minWidth: {
      label: "Min width",
      description: "minWidth"
    },
    minHeight: {
      label: "Min height",
      description: "minHeight"
    },
    domains: {
      control: 'object',
      description: 'Array with parameters start, end, color, label'
    }
  }
};

/**
 * Primary template with red background
 */
export const Domain = {
  args: {
    domains: [
      { start: 1, end: 100, color: "red", label: "Domain A" },
      { start: 110, end: 210, color: "blue", label: "Domain B" }
    ],
    id: 'Domains',
    height: 18,
    length: 770,
    displayStart: 1,
    displayEnd: 770,
    marginColor: "aliceblue",
    displayLabels: true,
    highlightEvent: "onclick",
    highlightColor: "#FFEB3B66",
    minWidth: 800,
    minHeight: 10,
  }
};
