import { QueryActionPayload } from './actions'

export const toString = (query: QueryActionPayload): string => {
  if (!query.where || !query.where.attribute) {
    return 'all'
  }
  return query.where.attribute + '=' + query.where.equals
}
