import { Action } from '../../actions';
import { OperationError } from '../types';
import * as actions from '../actions';
import { push } from '../../immutable';

export type State = OperationError[];

export const reducer = (state: State = [], action: Action<any>): State => {
  switch(action.type) {
    case actions.DATABASE_QUERY_ERROR:
      return push(state, { message: action.payload.error });
    case actions.DATABASE_PUSH_ERROR:
      return push(state, { message: action.payload.error });
    case actions.DATABASE_UPDATE_ERROR:
      return push(state, { message: action.payload.error });
    default:
      return state;
  }
}