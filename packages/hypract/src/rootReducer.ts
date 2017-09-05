import { combineReducers, AnyAction } from 'redux'

import { State as HypractState, reducer as hypractReducer } from './reducer'

export interface State {
  hypract: HypractState
}

export const reducer = (initial: Partial<State> = {}) =>
  combineReducers<State>({
    hypract: hypractReducer
  })
