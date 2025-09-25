import App from '../../App.vue';

export default {
  title: 'Pages/App',
  component: App,
  // This component will be rendered in the Canvas in a centered layout
  parameters: {
    layout: 'centered',
  },
};

/**
 * Primary instance of the App component
 */
export const Primary = {
  render: () => ({
    components: { App },
    template: '<App />'
  }),
};
