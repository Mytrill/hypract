import { get } from '../immutable'

import { EntitiesById, Query, PendingEditsByDatasource, QueryState } from './types'
import { queryToString, isIdAttribute } from './utils'
import { State } from '../reducer'

export const selectData = (state: State, query: Query): EntitiesById | undefined => {
  const entities = get(state, ['hypract', 'entities', 'data', query.entityType])
  // return all entities (if no restriction in query) or undefined if no data
  if (!entities || !query.where || !query.where.attribute) {
    return entities
  }

  if (isIdAttribute(query.where.attribute)) {
    if (!query.where.equals) {
      throw new Error('Cannot query where id === undefined')
    }
    const id = query.where.equals
    return { id: entities[id] }
  }

  const result = {}
  Object.keys(entities).forEach(id => {
    if (entities[id][query.where.attribute] === query.where.equals) {
      result[id] = entities[id]
    }
  })
  return result
}

export const selectPendingEdits = (state: State): PendingEditsByDatasource => {
  return get(state, ['hypract', 'entities', 'edits'])
}

export const selectQueryState = (state: State, query: Query): QueryState | undefined => {
  return get(state, ['hypract', 'entities', 'queries', queryToString(query)])
}
