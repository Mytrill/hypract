import { get as dotGet, set as dotSet } from './immutable'

/**
 * Get the nested value in the given object. Return undefined if does not exists.
 * 
 * @param object the object to get the value from, must not be null
 * @param path the property, e.g. 'child.name'
 * @return the value or undefined if the path doesn't exists in the object 
 */
export const get = (object: any, path: number | string | Array<number | string>): any => {
  return dotGet(object, path)
}

/**
 * push a value to the given array (without modifying it) and returns the new array.
 * 
 * @param array the array to push to
 * @param val the value to push
 * @return the new array
 */
export const push = <T>(array: T[], ...val: T[]): T[] => {
  return [].concat(array, val)
}

/**
 * Set the value at the given path in the given immutable object and return the new (updated) object.
 * 
 * @param object the object to set the value into (not mutated)
 * @param path the path to set the value to, e.g. 'child.name'
 * @param value the value to set
 * @return the newly generated object
 */
export const set = (object: any, path: number | string | Array<number | string>, value: any): any => {
  return dotSet(object, path, value)
}
