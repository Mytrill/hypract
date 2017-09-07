import { applyMiddleware, createStore, Reducer, combineReducers, Store } from 'redux'

import * as entities from './reducer'
import { thunk, logger } from './middlewares'
import { c_ud, edits, Action } from './actions'
import { NOOP } from './datasources'

interface State {
  hypract: HypractState
}

interface HypractState {
  entities: entities.State
}

let store: Store<State>

beforeEach(() => {
  const reducer = combineReducers<State>({
    hypract: combineReducers<HypractState>({
      entities: entities.reducer()
    })
  })
  store = createStore<State>(reducer, applyMiddleware(thunk))
})

// test('create', () => {
//   return store
//     .dispatch(
//       c_ud({
//         datasource: NOOP,
//         edits: [edits.create('EntityType', { numberProp: 0, booleanProp: false, stringProp: '' })]
//       })
//     )
//     .then(() => {
//       expect(store.getState().hypract.entities).toEqual({
//         data: {
//           EntityType: {
//             '0': {
//               _id: '0',
//               _type: 'EntityType',
//               _datasource: 'noop',
//               numberProp: 0,
//               booleanProp: false,
//               stringProp: ''
//             }
//           }
//         },
//         edits: {},
//         errors: [],
//         queries: {}
//       })
//     })
// })
