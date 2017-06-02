import { sortBy } from 'lodash';

import { QueryResult } from './';
import { Entity, SimpleType } from '../types';

export const isQueryResult =(value: any): value is QueryResult => {
  if(typeof value !== 'object') { 
    return false;
  }
  return Array.isArray(value.data);
}

export const isEmpty = (value: QueryResult): boolean => {
  return value.data.length === 0;
}


const getAttributeToSort = (entity: Entity): string | null => {
  for(const attr of Object.keys(entity.attributes)) {
    if(entity.attributes[attr].type === SimpleType.TITLE) {
      return attr;
    }
  }

  return null;
}

export const toSortedArray = (value: QueryResult, entity?: Entity, attribute?: string): Array<object> => {
  if(value.data.length <= 1) {
    return value.data;
  }

  if(!!attribute) {
    return sortBy(value.data, attribute);
  }

  const toSort = getAttributeToSort(entity);

  if(toSort) {
    return sortBy(value.data, toSort);
  }

  return value.data;
}

export const getOnlyResult = (value: QueryResult): object => {
  if(!value || !value.data) {
    throw new Error('Unexpected query result: ' + JSON.stringify(value));    
  }

  if(value.data.length !== 1) {
    throw new Error('Unexpected result count: ' + JSON.stringify(value));
  }

  return value.data[0];
}