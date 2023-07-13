import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPencilAlt, faGlobe } from '@fortawesome/free-solid-svg-icons';

library.add(faPencilAlt, faGlobe);
export const FontAwesome = (app) => {
  app.component('FaIcon', FontAwesomeIcon);
};
