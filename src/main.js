import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import './assets/style.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

const components = import.meta.glob('./components/App*.vue', { eager: true });
Object.keys(components).forEach((path) => {
  const name = path.match(/\.\/components\/(.*)\.vue$/)[1];
  const component = components[path].default;
  app.component(name, component);
});

app.mount('#app');
