import { Action } from '../../actions'
import * as actions from '../actions'
import { get, mergeDeep, set } from '../../immutable'

// # State

export type State = EntitiesByType

export interface EntitiesByType {
  [type: string]: EntitiesById
}

export interface EntitiesById {
  [id: string]: Entity
}

export interface Entity {
  _id: string
  _type: string
}

// # reducer

const applyEdit = (edit: actions.Edit, toMerge: any, entitiesByType: EntitiesByType): void => {
  if (!toMerge[edit.entityType]) {
    toMerge[edit.entityType] = {}
  }

  switch (edit.type) {
    case 'Create':
      if (!edit.id) {
        throw new Error('No ID set by the datasource for edit: ' + JSON.stringify(edit))
      }
      toMerge[edit.entityType][edit.id] = {
        _id: edit.id,
        _type: edit.entityType,
        ...edit.entity
      }
      break
    case 'Update':
      const current = get(entitiesByType, [edit.entityType, edit.id])
      if (!current) {
        // create entity
        toMerge[edit.entityType][edit.id] = {
          _id: edit.id,
          _type: edit.entityType,
          ...edit.updates
        }
        return
      }
      const previous = get(current, '_previous')

      if (previous || !current) {
        // entity already updated since previous commit, do not overrive the save
        toMerge[edit.entityType][edit.id] = edit.updates
      } else {
        // first update since last commit
        // save the current state of the entity
        toMerge[edit.entityType][edit.id] = {
          _previous: current,
          ...edit.updates
        }
      }
      break
    case 'Delete':
      toMerge[edit.entityType][edit.id] = { _deleted: true }
      break
    default:
      throw new Error('Edit type not recognised, edit: ' + JSON.stringify(edit))
  }
}

const applyEdits = (state: EntitiesByType, edits: actions.Edit[]): EntitiesByType => {
  const toMerge = {}

  edits.forEach((edit: actions.Edit) => {
    applyEdit(edit, toMerge, state)
  })

  return mergeDeep(state, [], toMerge)
}

const revertEdit = (edit: actions.Edit, toMerge: any, entitiesByType: EntitiesByType): void => {
  if (!toMerge[edit.entityType]) {
    toMerge[edit.entityType] = {}
  }

  switch (edit.type) {
    case 'Create':
      if (!edit.id) {
        throw new Error('No ID set by the datasource for edit: ' + JSON.stringify(edit))
      }
      toMerge[edit.entityType][edit.id] = undefined
      break
    case 'Update':
      const current = get(entitiesByType, [edit.entityType, edit.id])
      const previous = get(current, '_previous')
      if (!previous) {
        throw new Error('No save for ' + edit.entityType + ' with ID ' + edit.id)
      }
      toMerge[edit.entityType][edit.id] = previous
      break
    case 'Delete':
      toMerge[edit.entityType][edit.id] = { _deleted: undefined }
      break
    default:
      throw new Error('Edit type not recognised, edit: ' + JSON.stringify(edit))
  }
}

const revertEdits = (state: EntitiesByType, edits: actions.Edit[], recordChanges?: boolean): EntitiesByType => {
  const toMerge = {}

  edits.forEach((edit: actions.Edit) => {
    revertEdit(edit, toMerge, state)
  })

  return mergeDeep(state, [], toMerge)
}

export const reducer = (initialState: State = {}) => {
  return (state: State = initialState, action: Action<any>): State => {
    switch (action.type) {
      case actions.C_UD_ACTION_SUCCESS:
        return applyEdits(state, (action as Action<actions.C_UDActionSuccessPayload>).payload.edits)
      case actions.QUERY_ACTION_SUCCESS:
        // TODO
        break
      case actions.COMMIT_ACTION_ERROR:
        // TODO
        break
      case actions.COMMIT_ACTION_SUCCESS:
        // TODO
        break
      default:
    }

    return state
  }
}
