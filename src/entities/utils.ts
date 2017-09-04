import { Query } from './types'

export const queryToString = (query: Query): string => {
  if (!query.where || !query.where.attribute) {
    return 'all'
  }
  return query.where.attribute + '=' + query.where.equals
}

export const isIdAttribute = (attribute: string): boolean => {
  return attribute === 'id' || attribute === '_id'
}
