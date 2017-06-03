import firebase from 'firebase';

import { Entity } from '../types';
import { generateKey } from './utils';
import { resolveEntity } from '../utils';
import { synchronizeInStore } from './store';

/**
 * Creates an entity and save it on the server/local reactive cache.
 * 
 * @param entity The entity type to create
 * @param value The values to set for the given entity
 */
export const create = (entity: Entity, value: object): Promise<void> => {
  const key = generateKey();
  return <Promise<void>>firebase.database().ref(entity.name).child(key).set(value)
  .then(() => {
    const object = Object.assign({ id: key }, value);
    synchronizeInStore(entity, key, object);
  }, error => {
    console.log('Error while creating entity ' + JSON.stringify(entity) + ' with value: ' + JSON.stringify(value));
    return error;
  });
}
export default create;