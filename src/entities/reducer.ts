import { isArray, isObject } from 'lodash'
import { AnyAction, combineReducers } from 'redux'

import { Action } from '../actions'
import * as actions from './actions'

import * as data from './data'
import * as edits from './edits'
import * as errors from './errors'
import * as queries from './queries'

// # State

export interface State {
  data: data.State
  edits: edits.State
  errors: errors.State
  queries: queries.State
}

// # Reducer

export const reducer = (initialState: Partial<State> = {}) =>
  combineReducers<State>({
    data: data.reducer(initialState.data),
    edits: edits.reducer(initialState.edits),
    errors: errors.reducer(initialState.errors),
    queries: queries.reducer(initialState.queries)
  })
