import { Action, actionCreator } from '../actions';

export const SET_UI_STATE = 'hyptract/ui/SET_UI_STATE';

export interface SetUiStatePayload {
  widget: string[];
  property?: string | string[];
  value: any;
  custom?: boolean;
}

export const setUiState = actionCreator<SetUiStatePayload>(SET_UI_STATE);
