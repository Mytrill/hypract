import { get } from '../immutable'

import { State } from '../reducer'

export const selectUiState = (state: State, path: string | string[]) => {
  return get(state.hypract.ui, path)
}
