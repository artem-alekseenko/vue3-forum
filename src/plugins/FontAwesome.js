import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

library.add(faPencilAlt);
export const FontAwesome = (app) => {
  app.component('fa-icon', FontAwesomeIcon);
};
