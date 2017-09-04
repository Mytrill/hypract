import { Action } from '../../actions'
import { mergeShallow, set } from '../../immutable'
import * as actions from '../actions'
import { PendingEditsByDatasource } from '../types'

// # State

export type State = PendingEditsByDatasource

// # reducer

export const reducer = (initialState: State = {}) => {
  return (state: State = initialState, action: Action<any>): State => {
    switch (action.type) {
      case actions.C_UD_ACTION_SUCCESS:
        const cud = action as Action<actions.C_UDActionSuccessPayload>
        if (!cud.payload.source.localOnly) {
          return state
        }
        return mergeShallow(state, [cud.payload.source.datasource], cud.payload.source.edits)
      case actions.COMMIT_ACTION_SUCCESS:
        const commit = action as Action<actions.CommitActionSuccessPayload>
        return set(state, [commit.payload.source.datasource], [])
      default:
    }

    return state
  }
}
