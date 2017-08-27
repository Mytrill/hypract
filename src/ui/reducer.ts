import { set } from 'dot-prop-immutable';

import { SET_UI_STATE, SetUiStatePayload } from './actions';
import { Action } from '../actions';
import { getPath } from './getPath';

export interface SingleNodeState {
  [key: string]: any;
}

export interface SingleWidgetState {
  _custom: SingleNodeState;
}

export type UiComponentState = SingleWidgetState & SingleNodeState;

export interface TreeNodeWithState {
  _state?: UiComponentState;
}

export interface TreeNodeWithChildren {
  [children: string]: TreeNodeWithChildren;
}

export type TreeNode = TreeNodeWithState & TreeNodeWithChildren;

export type State = TreeNode;

const isSetUiStateAction = (action: Action<any>): action is Action<SetUiStatePayload> => {
  return action.type === SET_UI_STATE;
}

export const reducer = (state: State = {}, action: Action<any>): State => {
  if(isSetUiStateAction(action)) {
    const p = action.payload;
    return set(state, getPath(p.widget, p.property, p.custom), p.value);
  }
  return state;
}