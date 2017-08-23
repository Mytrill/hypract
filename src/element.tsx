import { h, cloneElement } from 'preact';
import { isArray, isEmpty, isNil } from 'lodash';

import { HypractComponent, PreactComponent } from './types';
import { isJsxElement } from './utils';


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

export const element = (Comp: HypractComponent, props?: any, extra?: any): JSX.Element => {
  const merged = merge(props, extra);
  if(isJsxElement(Comp)) {
    if(isNil(merged)) {
      return Comp;
    }
    return cloneElement(Comp, merged);
  }

  if(isNil(merged)) {
    return <Comp />;
  }
  return <Comp {...merged} />;
}

export const elements = (comps: HypractComponent[], props?: any, extra?: any): JSX.Element[] => {
  // potentially merge objects, do only once
  const merged = merge(props, extra);
  return comps.map(comp => element(comp, merged));
}

export const wrap = (elements: JSX.Element[], Tag: string | PreactComponent = 'div', props: any = {}): JSX.Element => {
  return <Tag {...props}>{elements}</Tag>;
}