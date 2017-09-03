import * as actions from './actions'
import { EntitiesById, Edit } from './types'

export interface Datasource {
  name: string
  query(query: actions.QueryActionPayload): Promise<EntitiesById>
  c_ud(c_ud: actions.C_UDActionPayload): Promise<void>
  commit(edits: Edit[]): Promise<void>
}

// ## no-op

export const NOOP = 'noop'
let id = 0

const NoopDatasource: Datasource = {
  name: NOOP,
  query(query: actions.QueryActionPayload): Promise<EntitiesById> {
    return Promise.resolve({})
  },
  c_ud(c_ud: actions.C_UDActionPayload): Promise<void> {
    // sets the ID for the created objects
    c_ud.edits.forEach(edit => {
      if (edit.type === 'Create') {
        edit.id = (id++).toString()
      }
    })
    return Promise.resolve()
  },
  commit(edits: Edit[]): Promise<void> {
    return Promise.resolve()
  }
}

interface DatasourcesByName {
  [name: string]: Datasource
}

let datasources: DatasourcesByName = {
  [NOOP]: NoopDatasource
}

export const add = (datasource: Datasource) => {
  datasources[datasource.name] = datasource
}

export const get = (name: string): Datasource | undefined => {
  return datasources[name]
}

export const clear = () => {
  datasources = {
    [NOOP]: NoopDatasource
  }
}
