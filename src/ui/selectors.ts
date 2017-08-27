import { get } from 'dot-prop-immutable';

import { State } from '../reducer';
import { getPath } from './getPath';

export const selectUiState = (state: State, widget: string[], property?: string | string[], custom?: boolean) => {
  return get(state.hypract.ui, getPath(widget, property, custom));
}