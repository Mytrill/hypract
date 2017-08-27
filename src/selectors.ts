import { isFunction, isObject, isUndefined } from 'lodash';
import { connect } from 'react-redux';

import { get } from 'dot-prop-immutable';

import { State } from './reducer';

export interface Selector<T = any> {
  (state: State, props: any): T;
  // usesState?: boolean; // Later on, if performance is an issue
}

export interface WithSelector {
  selector: Selector;
}

export const state = (path: string | string[]): Selector => {
  return (state: State, props: any) => {
    return get(state, path);
  };
}

export const uiState = (path: string | string[]): Selector => {
  return (state: State, props: any) => {
    return get(state.hypract.ui, path);
  }
}

export const stateOrProps = (path: string | string[]): Selector => {
  return (state: State, props: any) => {
      return get({ state, props }, path);
    }
}

export const props = (path: string | string[]): Selector => (state: State, props: any) => {
  return get(props, path);
}

export const not = (selector: Selector): Selector<boolean> => (state: State, props: any) => {
  return !selector(state, props);
}

export const and = (...selectors: Selector[]): Selector => (state: State, props: any) => {
  let result = false;
  for(const selector of selectors) {
    result = selector(state, props);
    if(!result) {
      return result;
    }
  }
  return result;
}

export const or = (...selectors: Selector[]): Selector => (state: State, props: any) => {
  let result = false;
  for(const selector of selectors) {
    result = selector(state, props);
    if(result) {
      return result;
    }
  }
  return result;
}

export const eq = (...selectors: Selector[]): Selector<boolean> => (state: State, props: any) => {
  let result = undefined;
  for(const selector of selectors) {
    const newResult = selector(state, props);
    if(!isUndefined(result) && result !== newResult) {
      return false;
    }
    result = newResult;
  }
  return true;
}

export interface StringMap {
  [key: string]: string;
}

function mapStateToProps(props: string[] | StringMap) {
  return (state: any, ownProps: any) => {
    const result = {};
  
    if(isObject(props)) {
      Object.keys(props).forEach(key => {
        const prop = ownProps[key];
        result[props[key]] = isFunction(prop) ? prop(state, props) : prop;
      })
    } else {
      (<string[]> props).forEach(key => {
        const prop = ownProps[key];
        result[key] = isFunction(prop) ? prop(state, props) : prop;
      })
    }

    return result;
  }
}

export function wrapInSelectors<O = any, I = any>(props: string[] | StringMap) {
  return (comp: React.ComponentType<I>) => {
    return connect(mapStateToProps(props))(comp) as React.ComponentClass<O>;
  }
}
