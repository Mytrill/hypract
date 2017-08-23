import { set } from 'dot-prop-immutable';

import { Action } from '../../actions';
import * as actions from '../actions';

export type State = any;

export const reducer = (state: State = {}, action: Action<any>): State => {
  switch(action.type) {
    case actions.DATABASE_QUERY_SUCCESS:
      // return u.updateIn(action.payload.path, action.payload.result, state);
      return set();
    case actions.DATABASE_PUSH_SUCCESS:
      const path = [...action.payload.path, action.payload.result]
      // return u.updateIn(path, action.payload.param, state);
      return set();
    case actions.DATABASE_UPDATE_SUCCESS:
      // return u.updateIn(action.payload.path, action.payload.result, state);
      return set();
    default:
      return state;
  }
}