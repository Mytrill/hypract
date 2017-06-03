import firebase from 'firebase';

import { getQueryResult, QueryResult } from './QueryResult';
import { ResolvedQuery } from './types';
import { synchronizeInStore } from './store';
import { getPath, isFetchQuery } from './utils';

const processSnapshot = (snapshot: firebase.database.DataSnapshot, query: ResolvedQuery): QueryResult => {
  const value = snapshot.val();

  // console.log('Processing value: ' + JSON.stringify(value));

  if(isFetchQuery(query)) {
    // the value is a single entity
    const id = query.whereIdEquals;
    let data = Object.assign({ id }, value);
    synchronizeInStore(query.entity, query.whereIdEquals, data);
  } else {
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

  const path = getPath(query.entity.name, query.whereIdEquals);

  return <Promise<QueryResult>> firebase.database().ref(path).once('value')
  .then(snapshot => {
    return processSnapshot(snapshot, query);
  }, error => {
    console.log('Error when querying data for query: ' + JSON.stringify(query) + ' error: ' + error);
    return error;
  });
}
export default query;

