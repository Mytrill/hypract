import firebase from 'firebase';

import { getQueryResult, QueryResult } from './QueryResult';
import { ResolvedQuery } from './types';
import { synchronizeInStore } from './store';
import { getPath, isFetchQuery } from './utils';

const processSnapshot = (snapshot: firebase.database.DataSnapshot, query: ResolvedQuery): QueryResult => {
  const value = snapshot.val();

  // console.log('Processing value: ' + JSON.stringify(value));

  if(isFetchQuery(query)) {
    if(!value) {
      throw new Error('No ' + query.entity.name + ' with ID: ' + query.whereIdEquals);      
    }
    // the value is a single entity
    const id = query.whereIdEquals;
    let data = Object.assign({ id }, value);
    synchronizeInStore(query.entity, query.whereIdEquals, data);
  } else if(!!value){
    // TODO handle null
    // The value is a map id -> entity
    Object.keys(value).forEach(key => {
      const val = value[key];
      val.id = key;
      synchronizeInStore(query.entity, key, val);
    });
  }

  return getQueryResult(query);
}

/**
 * Executes the given read query.
 * 
 * @param query The query to execute
 */
export const query = (query: ResolvedQuery): Promise<QueryResult> => {

  // first, check if query already exists in cache, if so, directly return the query result.


  // if not, construct firebase query from ResolvedQuery
  const path = getPath(query.entity, query.whereIdEquals);

  // execute query.

  // for each result, check lazy loaded attributes
  // if attribute already in cache, just add it
  // otherwise, run firebase query on each attribute and merge the results.

  return <Promise<QueryResult>> firebase.database().ref(path).once('value')
  .then(snapshot => {
    return processSnapshot(snapshot, query);
  })
  .catch(error => {
    console.log('Error when querying data for query: ' + JSON.stringify(query) + ' error: ' + error);
    return error;
  });
}
export default query;

