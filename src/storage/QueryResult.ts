import { computed } from 'mobx';
import { sortBy } from 'lodash';

import store from './store';
import { ResolvedQuery } from './types';

/**
 * The common interface for the result of a query.
 */
export interface QueryResult {

  getQuery: () => ResolvedQuery;

  size: () => number;

  single: () => object | null;

  list: () => Array<object>;
}
export default QueryResult;


const results = {};

/**
 * Get the reactive query result for the given query.
 * This method caches query results to make sure no expensive @computed values
 * are maitainted twice.
 * 
 * @param query The resolved query to get the result for
 */
export const getQueryResult = (query: ResolvedQuery): QueryResult => {
  if(query.whereIdEquals) {
    return new ByIdQueryResult(query);
  }

  const name = query.entity.name + '.all';
  if(results[name]) {
    return results[name];
  }

  const result = new GenericQueryResult(query);
  results[name] = result;
  return result;
}


/**
 * 
 */
export class ByIdQueryResult implements QueryResult {

  query: ResolvedQuery;

  constructor(query: ResolvedQuery) {
    this.query = query;
  }

  getQuery() {
    return this.query;
  }

  size() {
    return this.single() ? 1 : 0;
  }

  single() {
    return store.get(this.query.entity.name).get(this.query.whereIdEquals);
  }

  list() {
    return [ this.single() ];
  }
}


/**
 * 
 */
export class GenericQueryResult implements QueryResult {

  query: ResolvedQuery;

  constructor(query: ResolvedQuery) {
    this.query = query;
  }

  getQuery() {
    return this.query;
  }

  size() {
    return this.list.length;
  }

  single() {
    const list = this.list;
    if(list.length > 1) {
      throw new Error('More than one result for query: ' + JSON.stringify(this.query));
    }
    return list.length === 0 ? null: list[0];
  }

  list() {
    const result = store.get(this.query.entity.name).values();
    if(this.query.entity.__titleAttribute) {
      return sortBy(result, this.query.entity.__titleAttribute);
    }
    return result;
  }
}
