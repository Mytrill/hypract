import * as actions from '../../actions'
import { get, mergeDeep, set } from '../../immutable'
import { Edit, EntitiesById, EntitiesByType } from '../../types'

// # State

export type State = EntitiesByType

// # reducer

const applyEdit = (
  datasource: string,
  edit: Edit,
  toMerge: any,
  entitiesByType: EntitiesByType,
  localOnly: boolean
): void => {
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
        _datasource: datasource,
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
          _datasource: datasource,
          ...edit.updates
        }
        return
      }

      if (current._datasource !== datasource) {
        throw new Error(
          `Entity ${edit.entityType}.${edit.id} is already bound to datasource ${current._datasource}, cannot edit it with datasource ${current._datasource}`
        )
      }

      if (localOnly) {
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
      } else {
        toMerge[edit.entityType][edit.id] = {
          _previous: null, // reset previous
          ...edit.updates
        }
      }

      break
    case 'Delete':
      const toDelete = get(entitiesByType, [edit.entityType, edit.id])

      if (current._datasource !== datasource) {
        throw new Error(
          `Entity ${edit.entityType}.${edit.id} is already bound to datasource ${current._datasource}, cannot delete it with datasource ${current._datasource}`
        )
      }
      if (localOnly) {
        toMerge[edit.entityType][edit.id] = { _deleted: true }
      } else {
        toMerge[edit.entityType][edit.id] = null
      }

      break
    default:
      throw new Error('Edit type not recognised, edit: ' + JSON.stringify(edit))
  }
}

const applyEdits = (
  datasource: string,
  state: EntitiesByType,
  edits: Edit[],
  localOnly: boolean = false
): EntitiesByType => {
  const toMerge = {}

  edits.forEach((edit: Edit) => {
    applyEdit(datasource, edit, toMerge, state, localOnly)
  })

  return mergeDeep(state, [], toMerge)
}

const mergeQueryResults = (state: State, entityType: string, datasource: string, results: EntitiesById): State => {
  Object.keys(results).forEach(id => {
    results[id]._id = id
    results[id]._type = entityType
    results[id]._datasource = datasource
    results[id]._deleted = false
    results[id]._previous = null
  })

  return mergeDeep(state, [entityType], results)
}

const makeEditIrreversible = (state: State, edit: Edit, toMerge: any) => {
  if (!toMerge[edit.entityType]) {
    toMerge[edit.entityType] = {}
  }

  switch (edit.type) {
    case 'Update':
      toMerge[edit.entityType][edit.id] = { _previous: null }
      break
    case 'Delete':
      toMerge[edit.entityType][edit.id] = null
      break
    default:
  }
}

const makeEditsIrreversible = (state: State, edits: Edit[]): State => {
  const toMerge = {}

  edits.forEach(edit => {
    makeEditIrreversible(state, edit, toMerge)
  })

  return mergeDeep(state, [], toMerge)
}

export const reducer = (initialState: State = {}) => (
  state: State = initialState,
  action: actions.Action<any>
): State => {
  switch (action.type) {
    case actions.C_UD_ACTION_SUCCESS:
      const cudp = action.payload as actions.C_UDActionSuccessPayload
      return applyEdits(cudp.source.datasource, state, cudp.source.edits, cudp.source.localOnly)
    case actions.QUERY_ACTION_SUCCESS:
      const qasp = action.payload as actions.QueryActionSuccessPayload
      return mergeQueryResults(state, qasp.source.entityType, qasp.source.datasource, qasp.results)
    case actions.COMMIT_ACTION_SUCCESS:
      const casp = action.payload as actions.CommitActionSuccessPayload
      return makeEditsIrreversible(state, casp.edits)
    default:
  }

  return state
}

/*
const revertEdit = (edit: Edit, toMerge: any, entitiesByType: EntitiesByType): void => {
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

const revertEdits = (state: EntitiesByType, edits: Edit[], recordChanges?: boolean): EntitiesByType => {
  const toMerge = {}

  edits.forEach((edit: Edit) => {
    revertEdit(edit, toMerge, state)
  })

  return mergeDeep(state, [], toMerge)
}
*/
