import { get } from 'lodash';

import { ComponentProps, Data } from './types';

export const resolveData = (data: Data, props?: ComponentProps, value?: object): any => {
  // constant
  if(typeof data.constant !== 'undefined') {
    return data.constant;
  }

  // entity attribute
  if(typeof data.attribute === 'string') {
    if(!value) {
      throw new Error('Got data for attribute, but value not set.');
    }
    if(typeof value[data.attribute]) {
      throw new Error('Got data for attribute, doesn\'t have the attribute, attribute: ' + data.attribute);
    }

    return value[data.attribute];
  }

  // props
  if(Array.isArray(data.pathInProps)) {
    if(!props) {
      throw new Error('Got pathInProps for attribute, but props not set.');
    }

    return get(props, data.pathInProps);
  }
};
export default resolveData;
