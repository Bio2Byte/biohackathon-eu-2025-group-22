import vue from "@vitejs/plugin-vue";


const config = {
  stories: [
    "../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/vue3-vite",
    options: {}
  },
  plugins: [
    vue()
  ],
  core: {
    disableTelemetry: true,
  },
};

export default config;
