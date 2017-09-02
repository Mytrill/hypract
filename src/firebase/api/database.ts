import { conf } from './core'
import { Query } from '../types'

const GENERATED_ID_PATH = '__GENERATED_ID'

const handleFirebaseResponse = response => {
  if (response.status !== 200) {
    throw new Error(response.statusText)
  }

  return response.json()
}

const encodeQueryToUrlParams = (query: Query): string => {
  if (query.where && query.equals) {
    // compute the string value of the where clause
    let where
    if (typeof query.where === 'string') {
      where = query.where
      // } else if (query.where === Where.KEY) {
      //   where = '$key';
      // } else if (query.where === Where.VALUE) {
      //   where = '$value';
    } else {
      // must be an array
      where = query.where.join('/')
    }

    return `orderBy="${where}&equalTo=${JSON.stringify(query.equals)}`
  }
  return ''
}

/**
 * Query the given path.
 * 
 * @param path the path to query
 * @param query the additional conditions/orders to apply
 * @return a promise of the value at the given path
 */
export const query = (path: string, query: Query): any => {
  return fetch(`${conf.databaseURL}/${path}.json?${encodeQueryToUrlParams(query)}`).then(handleFirebaseResponse)
}

/**
 * Appends the given value to the path.
 * 
 * @param path the path that acts as a list/array to push the value to
 * @param value the value to push
 * @return A promise of the generated ID
 */
export const push = (path: string, value: any): Promise<string> => {
  return fetch(`${conf.databaseURL}/${path}.json`, {
    method: 'POST',
    body: JSON.stringify(value)
  })
    .then(handleFirebaseResponse)
    .then(body => {
      return body.name
    })
}

/**
 * Generates a unique ID in the server and returns a promise containing it.
 * 
 * This method will return a rejected promise if the user calling doesn't have the right to write on the path '__GENERATED_ID'.
 * @return A promise of the generated ID
 */
export const generateId = (): Promise<String> => {
  return push(GENERATED_ID_PATH, null)
}

/**
 * Update/merge the given value at the given path.
 * 
 * @param path the path to update
 * @param update the value to merge
 * @return a promise of the update
 */
export const update = (path: string, update: any): Promise<any> => {
  return fetch(`${conf.databaseURL}/${path}.json`, {
    method: 'PATCH',
    body: JSON.stringify(update)
  }).then(handleFirebaseResponse)
}
