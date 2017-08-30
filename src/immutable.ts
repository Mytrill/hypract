import { get as dotGet, merge as dotMerge, set as dotSet } from 'dot-prop-immutable'

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
 * Merges a value.  The target value must be an object, array, null, or undefined.
 * If target is an object, Object.assign({}, target, param) is used.
 * If target an array, target.concat(param) is used.
 * If target is null or undefined, the value is simply set.
 * 
 * @param object The object to evaluate.
 * @param path The path to the value.
 * @param val The value to merge into the target value.
 * @return the newly created object
 */
export const merge = (object: any, path: number | string | Array<number | string>, val: any): any => {
  return dotMerge(object, path, val)
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
 * @return the newly created object
 */
export const set = (object: any, path: number | string | Array<number | string>, value: any): any => {
  return dotSet(object, path, value)
}
