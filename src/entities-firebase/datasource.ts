import { Datasource, actions, EntitiesById, Edit, isIdAttribute } from '../entities'
import { api } from '../firebase'

export const datasource: Datasource = {
  name: 'firebase-rest',
  query(query: actions.QueryActionPayload): Promise<EntitiesById> {
    if (query.where && query.where.attribute) {
      if (isIdAttribute(query.where.attribute)) {
      } else {
      }
    } else {
    }
    api.database.query(query.entityType, { where: query.where.attribute, equals: query.where.equals })
    return null
  },
  c_ud(c_ud: actions.C_UDActionPayload): Promise<void> {
    // TODO
    return null
  },
  commit(edits: Edit[]): Promise<void> {
    // TODO
    return null
  }
}
