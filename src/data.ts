import { isNil, isFunction, isArray } from 'lodash';

import { render } from './template';

export interface Resolver<T> {
  (data: Data, props: any, defaultVal?: T): T | undefined;
}
export interface StringFn {
  (props: any): string;
}
export type Data = string | StringFn;

export type DataOrArray = Data | Data[];


export const toString = (data: Data, props: any, defaultVal?: string): string | undefined => {
  if(isNil(data)) {
    return defaultVal;
  }
  if(isFunction(data)) {
    return render(data(props), props);
  }
  return render(data, props);
}

export const toBoolean = (data: Data, props: any, defaultVal?: boolean): boolean | undefined => {
  if(isNil(data)) {
    return defaultVal;
  }
  return 'true' === toString(data, props);
}

export const toArray = <T>(data: DataOrArray, props: any, resolver: Resolver<T>, defaultVal?: T): Array<T | undefined> => {
  if(isArray(data)) {
    return data.map(val => resolver(val, props, defaultVal));
  }
  return [ resolver(data, props, defaultVal) ];
}

export const toStringArray = (data: DataOrArray, props: any, defaultVal?: string): Array<string | undefined> => {
  return toArray(data, props, toString, defaultVal);
}
