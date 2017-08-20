import { set } from 'dot-prop-immutable';

import { Action } from '../../types';
import { QueryStates } from '../types';
import { queryToString } from '../utils';
import * as actions from '../actions';

export type State = QueryStates;


const queryStarted = (state: State, action: Action<actions.QueryPayload>): State => {
  const path = [...action.payload.path, '__state', queryToString(action.payload.param)];
  return set(state, path, { done: false, success: false });
}

const querySuccess = (state: State, action: Action<actions.QuerySuccessPayload>): State => {
  const path = [...action.payload.path, '__state', queryToString(action.payload.param)];
  return set(state, path, { done: true, success: true });
}

const queryError = (state: State, action: Action<actions.QueryErrorPayload>): State => {
  const path = [...action.payload.path, '__state', queryToString(action.payload.param)];
  return set(state, path, { done: true, success: false });
}

// when a push is successfull, automatically set it as queried
const pushSuccess = (state: State, action: Action<actions.PushSuccessPayload>): State => {
  const path = [...action.payload.path, action.payload.result, '__state', 'all'];
  return set(state, path, { done: true, success: true });
} 

const reducers = {
  [actions.DATABASE_QUERY]: queryStarted,
  [actions.DATABASE_QUERY_SUCCESS]: querySuccess,
  [actions.DATABASE_QUERY_ERROR]: queryError,
  // weird typescript bug there..
  [actions.DATABASE_PUSH_SUCCESS]: <any> pushSuccess
}

export const reducer = (state: State = {}, action: Action<any>): State => {

  if(reducers[action.type]) {
    return reducers[action.type](state, action);
  }

  return state;
}