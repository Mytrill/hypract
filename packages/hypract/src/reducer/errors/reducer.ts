import * as actions from '../../actions'
import { OperationError } from '../../types'
import { push } from '../../immutable'

// # State

export type State = OperationError[]

// # reducer

export const reducer = (initialState: State = []) => (
  state: State = initialState,
  action: actions.Action<any>
): State => {
  switch (action.type) {
    case actions.C_UD_ACTION_ERROR:
      return push(state, { message: action.payload.error })
    case actions.COMMIT_ACTION_ERROR:
      return push(state, { message: action.payload.error })
    case actions.QUERY_ACTION_ERROR:
      return push(state, { message: action.payload.error })
    default:
      return state
  }
}
