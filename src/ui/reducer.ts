import { set } from 'dot-prop-immutable';

import { Action } from '../actions';
import { SET_UI_STATE } from './actions';

export type State = any;

export const reducer = (state: State = {}, action: Action<any>): State => {
  if(action.type == SET_UI_STATE) {
    return set(state, action.payload.path, action.payload.value);
  }
  return state;
}
