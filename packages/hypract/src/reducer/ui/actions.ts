import { Action, actionCreator } from '../actions';

export const SET_UI_STATE = 'hypract/ui/SET_UI_STATE';

export interface SetUiStatePayload {
  path: string | string[];
  value: any;
}

export const setUiState = actionCreator<SetUiStatePayload>(SET_UI_STATE);
