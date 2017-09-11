import { actions, Datasource, Entity, EntitiesById, Edit, isIdAttribute } from 'hypract'
import { database } from './api'

const set = (updates: any, entityType: string, entityId: string, value: any): void => {
  if (!updates[entityType]) {
    updates[entityType] = {}
  }

  updates[entityType][entityId] = value
}

const getUpdates = (edits: Edit[]) => {
  const updates = {}

  edits.forEach(edit => {
    if (!edit.id) {
      throw new Error('No ID set for edit ' + JSON.stringify(edit))
    }

    switch (edit.type) {
      case 'Create':
        set(updates, edit.entityType, edit.id, edit.entity)
        break
      case 'Update':
        set(updates, edit.entityType, edit.id, edit.updates)
        break
      case 'Delete':
        set(updates, edit.entityType, edit.id, null)
        break
    }
  })

  return updates
}

const computeIds = (edits: Edit[]): Promise<void[]> => {
  return Promise.all(
    edits.filter(edit => edit.type === 'Create').map(edit => {
      if (edit.id) {
        return Promise.resolve()
      }
      return database.generateId().then(id => {
        edit.id = id
      })
    })
  )
}

const applyEdits = (edits: Edit[], doComputeIds: boolean = true): Promise<void> => {
  if (doComputeIds) {
    return computeIds(edits).then(() => {
      const updates = getUpdates(edits)
      return database.update('', updates)
    })
  }
  const updates = getUpdates(edits)
  return database.update('', updates)
}

export const datasource: Datasource = {
  name: 'firebase-rest',
  query(query: actions.QueryActionPayload): Promise<EntitiesById> {
    let where
    let path = query.entityType
    if (query.where && query.where.attribute) {
      if (isIdAttribute(query.where.attribute)) {
        path += '/' + query.where.equals
      } else {
        where = { where: query.where.attribute, equals: query.where.equals }
      }
    }
    return database.query(query.entityType, where)
  },
  c_ud(c_ud: actions.C_UDActionPayload): Promise<void> {
    if (c_ud.localOnly) {
      return computeIds(c_ud.edits).then(() => {})
    }
    return applyEdits(c_ud.edits)
  },
  commit(edits: Edit[]): Promise<void> {
    return applyEdits(edits, false)
  }
}
