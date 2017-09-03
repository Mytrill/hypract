import { combineReducers, AnyAction } from 'redux'

import * as entities from './entities'
import * as firebase from './firebase'
import * as ui from './ui'

/**
 * The hypract specific state.
 */
export interface HypractState {
  entities: entities.State
  firebase: firebase.State
  ui: ui.State
}

/**
 * The reducer for the hypract slice of state.
 */
export const hypractReducer = (initial: Partial<HypractState> = {}) =>
  combineReducers<HypractState>({
    entities: entities.reducer(initial.entities),
    firebase: firebase.reducer(initial.firebase),
    ui: ui.reducer(initial.ui)
  })

/**
 * The entire state of the store: State = { hypract: HypractState }.
 */
export interface State {
  hypract: HypractState
}
