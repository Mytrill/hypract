import { Action } from '../../actions'
import * as actions from '../actions'

// # State

export type State = PendingEditsByDatasource

export interface PendingEditsByDatasource {
  [datasource: string]: actions.Edit[]
}

// # reducer

export const reducer = (initialState: State = {}) => {
  return (state: State = initialState, action: Action<any>): State => {
    // TODO
    return state
  }
}
