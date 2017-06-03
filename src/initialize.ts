import firebase from 'firebase';

import { App, SimpleType } from './types';
import { capitalizeFirstLetter } from './utils';

/**
 * Compute default values for all missing values in the app (e.g. entity name, entity paths).
 */
export const initialize = (app: App): void => {

  firebase.initializeApp(app.config.firebaseConfig);

  Object.keys(app.model).forEach(key => {
    const entity = app.model[key];
    // set the name
    if(!entity.name) {
      entity.name = key;
    }

    let titleAttribute = null;
    // set the attribute display name
    Object.keys(entity.attributes).forEach(attr => {
      const attribute = entity.attributes[attr];
      if(!attribute.displayName) {
        attribute.displayName = capitalizeFirstLetter(attr);
      }
      if(!attribute.name) {
        attribute.name = attr;
      }

      if(typeof attribute.nullable !== 'boolean') {
        attribute.nullable = true;
      }

      if(attribute.type === SimpleType.TITLE) {
        titleAttribute = attr;
      }
    });
    entity.__titleAttribute = titleAttribute;
  });
}
export default initialize;
