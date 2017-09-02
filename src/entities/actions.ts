import { Dispatch } from 'redux'

import { Action, actionCreator, actionCreatorWithoutPayload } from '../actions'
import { getDatasource, C_UDResults } from './datasource'

// # Action types

export const QUERY_ACTION = 'hypract/data/QUERY_ACTION'
export const QUERY_ACTION_SUCCESS = 'hypract/data/QUERY_ACTION_SUCCESS'
export const QUERY_ACTION_ERROR = 'hypract/data/QUERY_ACTION_ERROR'
export const C_UD_ACTION = 'hypract/data/C_UD_ACTION'
export const C_UD_ACTION_SUCCESS = 'hypract/data/C_UD_ACTION_SUCCESS'
export const C_UD_ACTION_ERROR = 'hypract/data/C_UD_ACTION_ERROR'
export const COMMIT_ACTION = 'hypract/data/COMMIT_ACTION'
export const COMMIT_ACTION_SUCCESS = 'hypract/data/COMMIT_ACTION_SUCCESS'
export const COMMIT_ACTION_ERROR = 'hypract/data/COMMIT_ACTION_ERROR'

// # Actions

export type DataAction = Action<QueryActionPayload> | Action<C_UDActionPayload> | Action<CommitActionPayload>

// ## Query Action

export interface QueryActionPayload {
  entityType: string
  where?: Where
}

export const query = actionCreator<QueryActionPayload>(QUERY_ACTION)

// ### types

export interface Where {
  attribute: string
  equals: any
}

// ## Edit Action

export interface C_UDActionPayload {
  edits: Edit[]
  datasource: string
  dryRun?: boolean
}

export interface C_UDActionSuccessPayload extends C_UDActionPayload {}

export interface C_UDActionErrorPayload {
  message: string
  source: C_UDActionPayload
}

// the actual action creator
const c_ud_start = actionCreator<C_UDActionPayload>(C_UD_ACTION)
const c_ud_success = actionCreator<C_UDActionPayload>(C_UD_ACTION_SUCCESS)
const c_ud_error = actionCreator<C_UDActionErrorPayload>(C_UD_ACTION_ERROR)

// the thunk action creator
export const c_ud = (payload: C_UDActionPayload) => {
  return (dispatch: Dispatch<any>, getState: () => any) => {
    dispatch(c_ud_start(payload))

    const datasource = getDatasource(payload.datasource)

    datasource
      .c_ud(payload)
      .then((result: C_UDResults) => {
        dispatch(c_ud_success(payload))
      })
      .catch((e: Error) => {
        dispatch(c_ud_error({ message: 'Operation failed: ' + e.message, source: payload }))
      })
  }
}

// ### edits

export type Edit = Create | Update | Delete

export interface Create {
  type: 'Create'
  entityType: string
  entity: any
  /** The id to set to the created entity. This field should be filled in be the data source. */
  id?: string
}

const create = (entityType: string, entity: any, id?: string): Create => ({
  type: 'Create',
  entityType,
  entity,
  id
})

export interface Update {
  type: 'Update'
  entityType: string
  id: string
  updates?: any
}

const update = (entityType: string, id: string, updates: any): Update => ({
  type: 'Update',
  entityType,
  id,
  updates
})

export interface Delete {
  type: 'Delete'
  entityType: string
  id: string
}

const del = (entityType: string, id: string): Delete => ({
  type: 'Delete',
  entityType,
  id
})

export const edits = {
  create,
  update,
  delete: del
}

// ## Commit Action

export interface CommitActionPayload {
  // for now, everything gets commited.
}

export const commit = actionCreatorWithoutPayload<CommitActionPayload>(COMMIT_ACTION)
