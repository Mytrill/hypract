import firebase from 'firebase';

import { computed, observable, ObservableMap } from 'mobx';

import { resolveEntity } from '../utils';
import { App, Entity, Query, QueryParameters, Model, ComponentProps } from '../types';

import * as utils from './utils';
export { utils };

/**
 * Generate a new unique key using Firebase's algorithm.
 */
export const generateKey = () => firebase.database().ref().push().key;


// /////////////////////////////////////////////////////////////////////////////////////
// 
// Store
// 
// /////////////////////////////////////////////////////////////////////////////////////


export const store: ObservableMap<ObservableMap<object>> = <ObservableMap<ObservableMap<object>>> observable.map();

/** Set the given value in the store at the given path and return the associated synchronized value. */
const synchronizeInStore = (entity: Entity, id: string, value: object): any => {

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


// /////////////////////////////////////////////////////////////////////////////////////
// 
// Queries
// 
// /////////////////////////////////////////////////////////////////////////////////////


export interface ResolvedQuery {
  entity: Entity;

  whereIdEquals?: string;
};

/** The result of a query. */
export interface QueryResult {
  data: Array<object>;
}

export const resolve = (app: App, query: Query, props: ComponentProps): ResolvedQuery => {
  const result = { entity: resolveEntity(query.entity, app), whereIdEquals: query.whereIdEquals };

  if(typeof result.whereIdEquals === 'string' && typeof result.whereIdEquals.startsWith(':')) {
    const key = result.whereIdEquals.substr(1);
    if(!props[key]) {
      throw new Error('Cannot resolve attribute "whereIdEquals" of query ' + JSON.stringify(query));
    }
    result.whereIdEquals = props[key];
  }

  return result;
}


// /////////////////////////////////////////////////////////////////////////////////////
// 
// Utils
// 
// /////////////////////////////////////////////////////////////////////////////////////


const getPath = (entity: string, id?: string): string => id ? entity + '/' + id : entity;


// /////////////////////////////////////////////////////////////////////////////////////
// 
// Create
// 
// /////////////////////////////////////////////////////////////////////////////////////

export interface CreateResult {
  error?: string;
}

export const create = (entity: Entity, value: object): Promise<CreateResult> => {
  const key = generateKey();
  return <Promise<CreateResult>>firebase.database().ref(entity.name).child(key).set(value)
  .then(() => {
    const object = Object.assign({ id: key }, value);
    synchronizeInStore(entity, key, object);
    return {};
  }, error => {
    console.log('Error while creating entity ' + JSON.stringify(entity) + ' with value: ' + JSON.stringify(value));
    return error;
  });
}


// /////////////////////////////////////////////////////////////////////////////////////
// 
// Read
// 
// /////////////////////////////////////////////////////////////////////////////////////

/** the @computed query results. */
const results = {};

const processSnapshot = (snapshot: firebase.database.DataSnapshot, query: ResolvedQuery): QueryResult => {
  const value = snapshot.val();

  if(typeof query.whereIdEquals === 'string') {
    if(!value) {
      return { data: [] };
    }

    const id = query.whereIdEquals;
    let result = Object.assign({ id }, value);
    // return the reactive value.
    result = synchronizeInStore(query.entity, query.whereIdEquals, result);

    return { data: [result] };
  } else {
    if(!value) {
      return { data: [] };
    }

    Object.keys(value).forEach(key => {
      const val = value[key];
      val.id = key;
      synchronizeInStore(query.entity, key, val);
    });

    // get or create the correct @computed function for this query
    const entity = query.entity.name;
    if(!results[entity]) {
      results[entity] = {};
    }

    // the function already exists, return it!
    if(results[entity].all) {
      return results[entity].all;
    }

    const result = {
      data: computed(() => {
        return store.get(query.entity.name).values();
      })
    };

    results[entity].all = result;

    return <any> result;
  }
}

export const read = (query: ResolvedQuery): Promise<QueryResult> => {

  const path = getPath(query.entity.name, query.whereIdEquals);

  return <Promise<QueryResult>> firebase.database().ref(path).once('value')
  .then(snapshot => {
    return processSnapshot(snapshot, query);
  }, error => {
    console.log('Error when querying data for query: ' + JSON.stringify(query) + ' error: ' + error);
    return error;
  });
}


// /////////////////////////////////////////////////////////////////////////////////////
// 
// Update
// 
// /////////////////////////////////////////////////////////////////////////////////////


export const update = (entity: Entity, value: object) => {
  throw new Error('To implement later.');
}
