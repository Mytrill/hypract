import { set } from '../../immutable'

import { Action, SET_UI_STATE } from '../../actions'

export type State = any

export const reducer = (initial: any = {}) => (state: State = initial, action: Action<any>): State => {
  if (action.type == SET_UI_STATE) {
    return set(state, action.payload.path, action.payload.value)
  }
  return state
}
