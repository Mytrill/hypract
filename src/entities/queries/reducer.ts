import { Action } from '../../actions'

// # State

export type State = QueriesByType

export interface QueriesByType {
  [type: string]: Queries
}

export interface Queries {
  all?: QueryState
  [name: string]: QueryState
}

export interface QueryState {
  done: boolean
  success: boolean
}

// # reducer

export const reducer = (initialState: State = {}) => {
  return (state: State = initialState, action: Action<any>): State => {
    // TODO
    return state
  }
}
