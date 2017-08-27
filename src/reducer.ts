import { combineReducers, AnyAction } from 'redux';

import * as firebase from './firebase';
import * as form from './form';
import * as ui from './ui';

/**
 * The hypract specific state.
 */
export interface HypractState {
  firebase: firebase.State;
  form: form.State;
  ui: ui.State;
}

/**
 * The reducer for the hypract slice of state.
 */
export const hypractReducer = combineReducers<HypractState>({
  firebase: firebase.reducer,
  form: form.reducer,
  ui: ui.reducer
});

/**
 * The entire state of the store: State = { hypract: HypractState }.
 */
export interface State {
  hypract: HypractState;
}
