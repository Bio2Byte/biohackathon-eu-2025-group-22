import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@nightingale-elements/nightingale-sequence';
import '@nightingale-elements/nightingale-manager';
import '@nightingale-elements/nightingale-navigation';
import '@nightingale-elements/nightingale-sequence';
import '@nightingale-elements/nightingale-colored-sequence';
import '@nightingale-elements/nightingale-track';
import '@nightingale-elements/nightingale-linegraph-track';
import '@nightingale-elements/nightingale-structure';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
