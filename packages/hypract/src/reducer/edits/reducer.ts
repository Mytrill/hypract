import * as actions from '../../actions'
import { mergeShallow, set } from '../../immutable'
import { PendingEditsByDatasource } from '../../types'

// # State

export type State = PendingEditsByDatasource

// # reducer

export const reducer = (initialState: State = {}) => {
  return (state: State = initialState, action: actions.Action<any>): State => {
    switch (action.type) {
      case actions.C_UD_ACTION_SUCCESS:
        const cudp = action.payload as actions.C_UDActionSuccessPayload
        if (!cudp.source.localOnly) {
          return state
        }
        return mergeShallow(state, [cudp.source.datasource], cudp.source.edits)
      case actions.COMMIT_ACTION_SUCCESS:
        const casp = action.payload as actions.CommitActionSuccessPayload
        return set(state, [casp.source.datasource], [])
      default:
    }

    return state
  }
}
