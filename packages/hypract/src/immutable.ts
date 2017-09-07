import isObject from 'lodash/isObject'
import { get as dotGet, merge as dotMerge, set as dotSet } from 'dot-prop-immutable'

export type Path = number | string | Array<number | string>

/**
 * Get the nested value in the given object. Return undefined if does not exists.
 * 
 * @param object the object to get the value from, must not be null
 * @param path the property, e.g. 'child.name'
 * @return the value or undefined if the path doesn't exists in the object 
 */
export const get = (object: any, path: Path): any => {
  return dotGet(object, path)
}

/**
 * Merges a value.  The target value must be an object, array, null, or undefined.
 * If target is an object, Object.assign({}, target, val) is used.
 * If target an array, target.concat(val) is used.
 * If target is null or undefined, the value is simply set.
 * 
 * @param object The object to evaluate.
 * @param path The path to the value.
 * @param val The value to merge into the target value.
 * @return the newly created object
 */
export const mergeShallow = (object: any, path: Path, val: any): any => {
  return dotMerge(object, path, val)
}

const mergeObjectsDeep = (target, source) => {
  let output = Object.assign({}, target)
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] })
        else output[key] = mergeObjectsDeep(target[key], source[key])
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }
  return output
}

export const mergeDeep = (object: any, path: Path, value: any): any => {
  return set(object, path, mergeObjectsDeep(get(object, path), value))
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
export const set = (object: any, path: Path, value: any): any => {
  return dotSet(object, path, value)
}
