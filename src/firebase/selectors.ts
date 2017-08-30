import { get } from '../immutable'

import { State } from '../reducer'
import { queryToString } from './utils'
import { Query, SingleQueryState } from './types'

// const queryByKey = (data: object, query: Query): any => {
//   return data[query.equals];
// }

// const queryByValue = (data: object, query: Query): any => {
//   const result = [];
//   Object.keys(data).forEach(key => {
//     if(data[key] == query.equals) {
//       result.add()
//     }
//   });
//   return result;
// }

export const selectQueryResults = (state: State, path: string[], query: Query): any => {
  // console.log('Query Selector', state);

  const data = get(state.hypract.firebase.database, path)

  if (query.where && query.equals) {
    if (typeof data !== 'object') {
      throw new Error(
        'Cannot compute query ' +
          JSON.stringify(query) +
          ' for path: ' +
          JSON.stringify(path) +
          ' because the value at the given path is not an object: ' +
          JSON.stringify(data)
      )
    }

    const result = []
    Object.keys(data).forEach(key => {
      const wherePath = [key].concat(query.where)
      if (get(data, wherePath) === query.equals) {
        result.push(data[key])
      }
    })
    return result
  }
  return data
}

export const selectQueryState = (state: State, path: string[], query: Query): SingleQueryState | undefined => {
  // console.log('Query State Selector', state);
  const pathInQueries = [...path, '__state', queryToString(query)]
  return get(state.hypract.firebase.queries, pathInQueries)
}
