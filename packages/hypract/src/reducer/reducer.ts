import { combineReducers, AnyAction } from 'redux'

import * as ui from './ui'
import * as data from './data'
import * as edits from './edits'
import * as errors from './errors'
import * as queries from './queries'
import * as actions from '../actions'

export interface State {
  data: data.State
  edits: edits.State
  errors: errors.State
  queries: queries.State
  ui: ui.State
}

export const reducer = (initial: Partial<State> = {}) =>
  combineReducers<State>({
    data: data.reducer(initial.data),
    edits: edits.reducer(initial.edits),
    errors: errors.reducer(initial.errors),
    queries: queries.reducer(initial.queries),
    ui: ui.reducer(initial.ui)
  })
