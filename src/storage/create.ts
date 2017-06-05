import firebase from 'firebase';

import { Entity } from '../types';
import { generateKey, getPath } from './utils';
import { resolveEntity } from '../utils';
import { synchronizeInStore } from './store';

/**
 * Creates an entity and save it on the server/local reactive cache.
 * 
 * @param entity The entity type to create
 * @param value The values to set for the given entity
 */
export const create = (entity: Entity, value: object): Promise<void> => {
  // generate new key
  const key = generateKey();
  
  // compute the Firebase update object
  const updates = {};
    Object.keys(entity.attributes).forEach(attr => {
    if(typeof value[attr] != null) {
      updates[getPath(entity, key, attr)] = value[attr];
    }
  });

  // execute update
  return <Promise<void>>firebase.database().ref().update(updates)
  .then(() => {
    // add the ID and add the object to the store.
    const object = Object.assign({ id: key }, value);
    synchronizeInStore(entity, key, object);
  }, error => {
    console.log('Error while creating entity ' + JSON.stringify(entity) + ' with value: ' + JSON.stringify(value));
    return error;
  });
}
export default create;