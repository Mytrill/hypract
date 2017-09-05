import { isEmpty, isFunction } from 'lodash'
import { Dispatch, Store } from 'redux'

import { State } from './reducer'
import * as datasources from './datasources'
import { selectPendingEdits, selectQueryState } from './selectors'
import { Create, Query, Update, Delete, Edit, EntitiesById } from './types'

// # General

export interface Action<P = any> {
  type: string
  payload: P
  error?: boolean
}

export type ActionFactory<E = any, P = any, S = any> = (props: P, state: S, e: E) => Action<any>

export const isActionFactory = (value: any): value is ActionFactory => {
  if (isFunction(value)) {
    return value.length === 3
  }
  return false
}

export function actionCreator<P>(type: string): (payload: P) => Action<P> {
  return (payload: P) => ({
    type,
    payload
  })
}

export function actionCreatorWithoutPayload<P = {}>(type: string): () => Action<{}> {
  return () => ({
    type,
    payload: {}
  })
}

export function actionCreatorWithError<P>(type: string): (payload: P) => Action<P> {
  return (payload: P) => ({
    type,
    payload,
    error: true
  })
}

export function actionToHandler<E = any, P = any, S = any>(
  actionOrFactory: ActionFactory<E, P, S> | Action,
  props?: P,
  store?: Store<S>
) {
  if (!actionOrFactory) {
    return undefined
  }

  return (e: E) => {
    if (isActionFactory(actionOrFactory)) {
      const action = actionOrFactory(props, store.getState(), e)

      if (action) {
        store.dispatch(action)
      }
    }

    store.dispatch(<Action>actionOrFactory)
  }
}

// # Entities

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
export const SET_UI_STATE = 'hypract/ui/SET_UI_STATE'

// # Actions

export type DataAction = Action<QueryActionPayload> | Action<C_UDActionPayload> | Action<CommitActionPayload>

// ## Query Action

export interface QueryActionPayload extends Query {
  datasource: string
}

export interface QueryActionSuccessPayload {
  source: QueryActionPayload
  results: EntitiesById
}

export interface QueryActionErrorPayload {
  message: string
  source: QueryActionPayload
}

// actual actions
const query_start = actionCreator<QueryActionPayload>(QUERY_ACTION)
const query_success = actionCreator<QueryActionSuccessPayload>(QUERY_ACTION_SUCCESS)
const query_error = actionCreatorWithError<QueryActionErrorPayload>(QUERY_ACTION_ERROR)

// thunk action creator
export const query = (payload: QueryActionPayload) => {
  return (dispatch: Dispatch<State>, getState: () => State) => {
    // check the cache
    const queryState = selectQueryState(getState(), payload)
    if (queryState && (!queryState.done || queryState.success)) {
      return
    }

    dispatch(query_start(payload))

    const datasource = datasources.get(payload.datasource)
    if (!datasource) {
      throw new Error('No datasource registered with name ' + payload.datasource)
    }

    return datasource
      .query(payload)
      .then((results: EntitiesById) => {
        return dispatch(query_success({ results, source: payload }))
      })
      .catch((e: Error) => {
        return dispatch(query_error({ message: 'Query failed: ' + e.message, source: payload }))
      })
  }
}

// ## Edit Action

export interface C_UDActionPayload {
  edits: Edit[]
  datasource: string
  localOnly?: boolean
}

export interface C_UDActionSuccessPayload {
  source: C_UDActionPayload
}

export interface C_UDActionErrorPayload {
  message: string
  source: C_UDActionPayload
}

// the actual action creator
const c_ud_start = actionCreator<C_UDActionPayload>(C_UD_ACTION)
const c_ud_success = actionCreator<C_UDActionSuccessPayload>(C_UD_ACTION_SUCCESS)
const c_ud_error = actionCreatorWithError<C_UDActionErrorPayload>(C_UD_ACTION_ERROR)

// the thunk action creator
export const c_ud = (payload: C_UDActionPayload) => {
  return (dispatch: Dispatch<State>, getState: () => State) => {
    dispatch(c_ud_start(payload))

    const datasource = datasources.get(payload.datasource)

    return datasource
      .c_ud(payload)
      .then(() => {
        return dispatch(c_ud_success({ source: payload }))
      })
      .catch((e: Error) => {
        return dispatch(c_ud_error({ message: 'Operation failed: ' + e.message, source: payload }))
      })
  }
}

// ### edits

const create = (entityType: string, entity: any, id?: string): Create => ({
  type: 'Create',
  entityType,
  entity,
  id
})

const update = (entityType: string, id: string, updates: any): Update => ({
  type: 'Update',
  entityType,
  id,
  updates
})

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
  datasource: string
}

export interface CommitActionSuccessPayload {
  source: CommitActionPayload
  edits: Edit[]
}

export interface CommitActionErrorPayload {
  message: string
  source: CommitActionPayload
  edits: Edit[]
}

const commit_start = actionCreator<CommitActionPayload>(COMMIT_ACTION)
const commit_success = actionCreator<CommitActionSuccessPayload>(COMMIT_ACTION_SUCCESS)
const commit_error = actionCreatorWithError<CommitActionErrorPayload>(COMMIT_ACTION_ERROR)

// thunk action creator
export const commit = (payload: CommitActionPayload) => {
  return (dispatch: Dispatch<State>, getState: () => State) => {
    dispatch(commit_start(payload))

    const edits = selectPendingEdits(getState())[payload.datasource]
    if (isEmpty(edits)) {
      return dispatch(commit_success({ source: payload, edits }))
    }

    const datasource = datasources.get(payload.datasource)
    if (!datasource) {
      throw new Error('No datasource registered with name ' + payload.datasource)
    }

    return datasource
      .commit(edits)
      .then(() => {
        return dispatch(commit_success({ source: payload, edits }))
      })
      .catch((error: Error) => {
        return dispatch(
          commit_error({
            source: payload,
            edits,
            message: 'Failed to commit in datasource ' + datasource.name + ' reason: ' + error.message
          })
        )
      })
  }
}

// ### UI

export interface SetUiStatePayload {
  path: string | string[]
  value: any
}

export const setUiState = actionCreator<SetUiStatePayload>(SET_UI_STATE)
