import { set } from '../../immutable'

import { Action } from '../../actions'
import * as actions from '../actions'

export type State = any

export const reducer = (initial: State = {}) => (state: State = initial, action: Action<any>): State => {
  switch (action.type) {
    case actions.DATABASE_QUERY_SUCCESS:
      return set(state, action.payload.path, action.payload.result)
    case actions.DATABASE_PUSH_SUCCESS:
      const path = [...action.payload.path, action.payload.result]
      return set(state, path, action.payload.param)
    case actions.DATABASE_UPDATE_SUCCESS:
      return set(state, action.payload.path, action.payload.result)
    default:
      return state
  }
}
