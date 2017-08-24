import * as React from 'react';
import { isArray, isBoolean, isEmpty, isFunction, isNil, isNumber, isObject, isString } from 'lodash';

import { HypractComponent, ReactComponent, ReactElement } from './types';


const nilOrEmpty = (props?: any): boolean => isNil(props) || isEmpty(props);

const merge = (props?: any, extra?: any): any | null => {
  if (nilOrEmpty(props)) {
    if (nilOrEmpty(extra)) {
      return null;
    } else {
      return extra;
    }
  } else {
    if (nilOrEmpty(extra)) {
      return props;
    } else {
      return Object.assign({}, props, extra);
    }
  }
}

export const element = (Comp: HypractComponent, props?: any, extra?: any, Tag: string | ReactComponent = 'div', wrapperProps: any = {}): ReactElement => {
  const merged = merge(props, extra);

  if(isArray(Comp)) {
    return wrap(elements(Comp, props, extra), Tag, wrapperProps);
  }

  if(React.isValidElement(Comp)) {
    if(isNil(merged)) {
        return Comp;
    }
    return React.cloneElement(Comp, merged);
  }

  if(isBoolean(Comp) || isNumber(Comp)) {
    return null;
  }

  if(isFunction(Comp) || isString(Comp)) {
    return <Comp {...merged} />
  }

  console.log('Got weird Comp', Comp);
  throw new Error('Got weird Comp');
}

export const elements = (comps: HypractComponent[], props?: any, extra?: any): ReactElement[] => {
  // potentially merge objects, do only once
  const merged = merge(props, extra);
  return comps.map(comp => element(comp, merged));
}

export const wrap = (elements: JSX.Element[], Tag: string | ReactComponent = 'div', props: any = {}): JSX.Element => {
  return <Tag {...props}>{elements}</Tag>;
}