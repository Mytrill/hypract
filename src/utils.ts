import { isNil, isArray, isFunction } from 'lodash';
import { h, cloneElement } from 'preact';

import { render } from './template';
import { Action, Data, DataOrArray, Resolver } from './types';
import { ComponentConf, ComponentProps, PreactComponent, WithWrappers } from './types';


export function actionCreator<P>(type: string): (payload: P) => Action<P> {
  return (payload: P) => ({
    type,
    payload
  });
}

export function actionCreatorWithError<P>(type: string): (payload: P) => Action<P> {
  return (payload: P) => ({
    type,
    payload,
    error: payload instanceof Error ? true : (typeof payload === 'object' && payload['error']) ? true : undefined
  });
}

export function push<T>(array: T[], val: T): T[] {
  return [].concat(array, [val]);
}


export const createComponentConfFactory = <T> (renderer: PreactComponent) => (conf: T & WithWrappers) => {
  if(conf['wrappers']) {
    return wrap(Object.assign(conf, { renderer }));
  }
  return Object.assign(conf, { renderer });
}

export const wrap = <T> (wrapped: WithWrappers & ComponentConf & T): ComponentConf => {
  
  let result = <ComponentConf> wrapped;
  
  if(wrapped.wrappers) {
    wrapped.wrappers.forEach(wrapper => {
      wrapper.children = [ result ];
      result = wrapper;
    });
  }

  return result;
}

const isElement = (elt: any): elt is JSX.Element => {
  return elt && elt.nodeName;
}

const merge = (props?: object, extra: object = {}, extra2: object = {}): object => {
  if(Object.keys(extra).length === 0 && Object.keys(extra2).length === 0) {
    return props;
  }
  return Object.assign({}, props, extra, extra2);
}

export const renderToElement = (conf: ComponentConf | ComponentConf[], props?: object, extra: object = {}): JSX.Element => {
  if(!conf) {
    return undefined;
  }

  if(Array.isArray(conf)) {
    return h('div', {}, renderToArray(conf, props, extra));
  }

  if(isElement(conf)) {
    if(!props || Object.keys(props).length === 0) {
      return conf;
    }
    return cloneElement(conf, merge(props, extra));
  }
  
  if(typeof conf === 'function') {
    return h(conf, merge(props, extra));
  }

  if(!conf.renderer) {
    throw new Error('Cannot render conf ' + JSON.stringify(conf) + ' because it has no renderer.');
  }
  return h(conf.renderer, merge(props, extra, { conf }));
};

const renderToArray = (confs: ComponentConf[], props: object, extra: object = {}): JSX.Element[] => (
  confs ? confs.map(single => renderToElement(single, props, extra)) : []
);

export const renderChildrenToElement = ({ conf, ...rest }: ComponentProps<any>, extra: object = {}): JSX.Element => {
  return renderToElement(conf.children || rest['children'], rest, extra);
}

export const renderChildrenToArray = ({ conf, ...rest }: ComponentProps<any>, extra: object = {}): JSX.Element[] => {
  return renderToArray(conf.children || rest['children'], rest, extra);
}

// const orUndefined = <S, T>(resolver: Resolver<S, T>): Resolver<S | undefined | null, T | undefined> => {
//   return (source: S | undefined | null): T | undefined => {
//     if(isNil(source) || isNil(resolver)) {
//       return undefined;
//     }
//     return resolver(source);
//   }
// }

// const ifDefined = <S, T>(data: S | null | undefined) => (resolver: Resolver<S, T>): T | undefined => {
//   if(isNil(data) || isNil(resolver)) {
//     return undefined;
//   }
//   return resolver(data);
// }

// const dataToString: Resolver<any, Resolver<Data, string>> = (props: any) => (data: Data): string => {
//   if(typeof data === 'function') {
//     return render(data(props), props);
//   }
//   return render(data, props);
// }

// const toArray = <T>(value: T | T[]): T[] => {
//   if(isArray(value)) {
//     return value;
//   }
//   return [value];
// }

// const stringToBoolean: Resolver<string, boolean> = (source: string): boolean => {
//   return 'true' === source;
// }

const dataToString = (data: Data, props: any, defaultVal?: string): string | undefined => {
  if(isNil(data)) {
    return defaultVal;
  }
  if(isFunction(data)) {
    return render(data(props), props);
  }
  return render(data, props);
}

const dataToBoolean = (data: Data, props: any, defaultVal?: boolean): boolean | undefined => {
  if(isNil(data)) {
    return defaultVal;
  }
  return 'true' === dataToString(data, props);
}

const dataToArray = <T>(data: DataOrArray, props: any, resolver: Resolver<T>, defaultVal?: T): Array<T | undefined> => {
  if(isArray(data)) {
    return data.map(val => resolver(val, props, defaultVal));
  }
  return [ resolver(data, props, defaultVal) ];
}

const dataToStringArray = (data: DataOrArray, props: any, defaultVal?: string): Array<string | undefined> => {
  return dataToArray(data, props, dataToString, defaultVal);
}

export const data = {
  toString: dataToString,
  toArray: dataToArray,
  toBoolean: dataToBoolean,
  toStringArray: dataToStringArray 
}
