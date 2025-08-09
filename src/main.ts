import { createApp } from 'vue';
import { createPinia } from 'pinia';

import '@/style.css';
import App from '@/App.vue';

import router from '@/router/index';

// Gitart Vue Dialog
import 'gitart-vue-dialog/dist/style.css';
import { GDialog } from 'gitart-vue-dialog';

// import the fontawesome core
import { library } from '@fortawesome/fontawesome-svg-core';

// import font awesome icon component
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText,
} from '@fortawesome/vue-fontawesome';

// import specific icons
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

// add icons to the library
library.add(fas, far, fab);

// vue3-snackbar
import { SnackbarService, Vue3Snackbar } from 'vue3-snackbar';
import 'vue3-snackbar/styles';

createApp(App)
  .use(router)
  .use(createPinia())
  .use(SnackbarService)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('font-awesome-layers', FontAwesomeLayers)
  .component('font-awesome-layers-text', FontAwesomeLayersText)
  .component('GDialog', GDialog)
  .component('vue3-snackbar', Vue3Snackbar)
  .mount('#app');
