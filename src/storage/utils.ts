import firebase from 'firebase';

import { isArray, sortBy } from 'lodash';
import { isObservableArray } from 'mobx';

import { QueryResult, ByIdQueryResult, GenericQueryResult} from './QueryResult';
import { ResolvedQuery } from './types';
import { capitalizeFirstLetter, resolveEntity } from '../utils';
import { App, ComponentProps, Entity, Query, SimpleType } from '../types';


/**
 * Generate a new unique key using Firebase's algorithm.
 */
export const generateKey = () => firebase.database().ref().push().key;


/**
 * Compute the resolved query associated to the given query.
 * 
 * @param app The app
 * @param query The query to resolve
 * @param props the props to use to resolve the query
 */
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

/**
 * Get the path for the given entity/id.
 * 
 * @param entity The entity
 * @param id the id, or undefined if computing the path for the entity type only
 */
export const getPath = (entity: Entity, id?: string, attribute?: string): string => {
// id ? entity + '/' + id : entity;

  if(attribute && id) {
    const attr = entity.attributes[attribute];
    if(!attr) {
      throw new Error('No attribute "' + attribute + '" in entity "' + entity.name + '".');
    }

    if(attr.lazy) {
      return entity.name + capitalizeFirstLetter(attribute) + '/' + id;
    } else {
      return entity.name + '/' + id + '/' + attribute;
    }
  } else if (id) {
    return entity.name + '/' + id;
  }

  return entity.name;
}


/**
 * Computes if this query is a 'fetch', i.e. a query that gets an entity by id.
 * @param query The query
 */
export const isFetchQuery = (query: ResolvedQuery): boolean => {
  return typeof query.whereIdEquals === 'string';
}

/**
 * Checks and casts the given object as a QueryResult.
 * 
 * @param result the object to be tested
 */
export const isQueryResult = (result: any): result is QueryResult => {
  return result instanceof ByIdQueryResult || result instanceof GenericQueryResult;
} 