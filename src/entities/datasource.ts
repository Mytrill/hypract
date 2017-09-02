import * as actions from './actions'
import { EntitiesById } from './data/reducer'

export interface Datasource {
  name: string
  query(query: actions.QueryActionPayload): Promise<EntitiesById>
  c_ud(c_ud: actions.C_UDActionPayload): Promise<C_UDResults>
  commit(): Promise<CommitResults>
}

export interface C_UDResults {
  // TODO implement
}

export interface CommitResults {
  // TODO implement
}

// ## local

const localDatasource: Datasource = {
  name: 'local',
  query(query: actions.QueryActionPayload): Promise<EntitiesById> {
    // empty, should be noop?
    return Promise.resolve({})
  },
  c_ud(c_ud: actions.C_UDActionPayload): Promise<C_UDResults> {
    // TODO implement

    return null
  },
  commit(): Promise<CommitResults> {
    // TODO implement

    return null
  }
}

interface DatasourcesByName {
  [name: string]: Datasource
}

const datasources: DatasourcesByName = {
  local: localDatasource
}

export const addDatasource = (datasource: Datasource) => {
  datasources[datasource.name] = datasource
}

export const getDatasource = (name: string): Datasource | undefined => {
  return datasources[name]
}
