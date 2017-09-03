import { Query } from './types'

export const toString = (query: Query): string => {
  if (!query.where || !query.where.attribute) {
    return 'all'
  }
  return query.where.attribute + '=' + query.where.equals
}
