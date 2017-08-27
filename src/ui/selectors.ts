import { get } from 'dot-prop-immutable';

import { State } from '../reducer';

export const selectUiState = (state: State, path: string | string[]) => {
  return get(state.hypract.ui, path);
}
