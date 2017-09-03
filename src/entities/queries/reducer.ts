import { Action } from '../../actions'
import { set } from '../../immutable'
import * as actions from '../actions'
import { QueryStatesByType } from '../types'
import { toString } from '../utils'

// # State

export type State = QueryStatesByType

// # reducer

export const reducer = (initialState: State = {}) => {
  return (state: State = initialState, action: Action<any>): State => {
    switch (action.type) {
      case actions.QUERY_ACTION:
        const qap = action.payload as actions.QueryActionPayload
        return set(state, [qap.entityType, toString(qap)], { done: false, success: false })
      case actions.QUERY_ACTION_SUCCESS:
        const qasp = action.payload as actions.QueryActionSuccessPayload
        return set(state, [qap.entityType, toString(qasp.source)], { done: true, success: true })
      case actions.QUERY_ACTION_ERROR:
        const qaep = action.payload as actions.QueryActionErrorPayload
        return set(state, [qap.entityType, toString(qaep.source)], { done: true, success: false })
    }
    return state
  }
}
