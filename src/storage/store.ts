import { computed, observable, ObservableMap } from 'mobx';

import { Entity } from '../types';

export const store: ObservableMap<ObservableMap<object>> = <ObservableMap<ObservableMap<object>>> observable.map();
export default store;

/** Set or merge the given value in the store at the given path and return the associated synchronized value. */
export const synchronizeInStore = (entity: Entity, id: string, value: object): any => {

  // console.log('Synchronizing in store: ' + JSON.stringify(value));

  let entities: any = store.get(entity.name);
  if(!entities) {
    entities = observable.map()
    store.set(entity.name, entities);
  }

  let result = entities.get(id);
  if(!result) {
    // not cached, add it
    const toAdd = Object.assign({}, value);
    // set non-existing keys to undefined, so that MobX can pick them up.
    Object.keys(entity.attributes).forEach(key => {
      if(!(key in toAdd)) {
        toAdd[key] = undefined;
      }
    });
    entities.set(id, toAdd);
    return entities.get(id);
  }
  
  // already cached, update it
  // if a new attribute is fetched, make sure to add it.
  Object.keys(value).forEach(key => {
    if(result[key] !== value[key]) {
      result[key] = value[key];
    }
  });
  // return the reactive instance
  return result;
}

export const contains = (entity: Entity, id: string, attribute?: string): boolean => {
  const instances = store.get(entity.name);
  if(!instances) {
    return false;
  }
  const instance = instances.get(id);
  return instance && (!attribute || typeof instance[attribute] !== 'undefined');
}