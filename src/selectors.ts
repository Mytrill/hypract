import { isFunction, isString, isUndefined } from 'lodash';
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

export const props = (path: string | string[]): Selector => {
  return (state: State, props: any) => {
    return get(props, path);
  }
}

export const value = (value: any): Selector => {
  return (state: State, props: any) => {
    return value;
  }
}

export const not = (selector: Selector): Selector<boolean> => {
  return (state: State, props: any) => {
    return !selector(state, props);
  }
}

export const and = (...selectors: Selector[]): Selector => {
  return (state: State, props: any) => {
    let result = false;
    for(const selector of selectors) {
      result = selector(state, props);
      if(!result) {
        return result;
      }
    }
    return result;
  }
}

export const or = (...selectors: Selector[]): Selector => {
  return (state: State, props: any) => {
    let result = false;
    for(const selector of selectors) {
      result = selector(state, props);
      if(result) {
        return result;
      }
    }
    return result;
  }
}

export const eq = (...selectors: Selector[]): Selector<boolean> => {
  return (state: State, props: any) => {
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
}

export interface SelectorMap {
  [key: string]: string | Selector;
}

function mapStateToProps(props: SelectorMap) {
  return (state: any, ownProps: any) => {
    const result = {};
    Object.keys(props).forEach(key => {
      const ownProp = ownProps[key];
      const prop = props[key];
      if(isString(prop)) {
        result[prop] = isFunction(ownProp) ? ownProp(state, props) : ownProp;
      } else {
        result[key] = prop(state, props);
      }
    })

    return result;
  }
}

export function wrapInSelectors<O = any, I = any>(props: SelectorMap) {
  return (comp: React.ComponentType<I>) => {
    return connect(mapStateToProps(props))(comp) as React.ComponentClass<O>;
  }
}
