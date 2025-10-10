import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname = typeof __dirname !== 'undefined'
  ? __dirname
  : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    // IMPORTANT: put compilerOptions here (applies to dev/build)
    vue({
      template: {
        compilerOptions: {
          // be specific or allow the whole Nightingale family
          isCustomElement: (tag) => tag === 'nightingale-sequence' || tag.startsWith('nightingale-'),
        },
      },
    }),

    // Your test/storybook plugin (this part only affects tests)
    storybookTest({
      configDir: path.join(dirname, '.storybook'),
    }),
  ],

  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },

  // If you want the browser testing project config, keep it,
  // but remove the extra nested vue() plugin from the test plugin list.
  test: {
    projects: [{
      extends: true,
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          instances: [{ browser: 'chromium' }],
        },
        setupFiles: ['.storybook/vitest.setup.js'],
      },
    }],
  },
});
