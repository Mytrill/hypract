import { Dispatch } from 'redux';
import { get } from 'dot-prop-immutable';

import { database } from './api';
import { queryStateSelector } from './selectors';
import { Query, SingleQueryState } from './types';
import { apiActionCreator, queryToString } from './utils';

export const DATABASE_QUERY = 'firebase/DATABASE_QUERY';
export const DATABASE_QUERY_SUCCESS = 'firebase/DATABASE_QUERY_SUCCESS';
export const DATABASE_QUERY_ERROR = 'firebase/DATABASE_QUERY_ERROR';
export const DATABASE_PUSH = 'firebase/DATABASE_PUSH';
export const DATABASE_PUSH_SUCCESS = 'firebase/DATABASE_PUSH_SUCCESS';
export const DATABASE_PUSH_ERROR = 'firebase/DATABASE_PUSH_ERROR';
export const DATABASE_UPDATE = 'firebase/DATABASE_UPDATE';
export const DATABASE_UPDATE_SUCCESS = 'firebase/DATABASE_UPDATE_SUCCESS';
export const DATABASE_UPDATE_ERROR = 'firebase/DATABASE_UPDATE_ERROR';

export interface QueryPayload {
  path: string[];
  param: Query;
}

export interface QuerySuccessPayload {
  path: string[];
  param: Query;
  result: any;
}

export interface QueryErrorPayload {
  path: string[];
  param: Query;
  error: string;
}

const queryCacheHit = (state: any, path: string[], param: Query): boolean => {
  const query = queryStateSelector(state, path, param);

  // console.log('Computing cache hit', query);

  if(!query) {
    return false;
  }

  // cache hit if the query is in progress, or suceeded, cache miss if failed
  return !query.done || query.success;
}

export const query = apiActionCreator<Query, any>([ DATABASE_QUERY, DATABASE_QUERY_SUCCESS, DATABASE_QUERY_ERROR ], database.query, queryCacheHit);

export interface PushPayload {
  path: string[];
  param: any;
}

export interface PushSuccessPayload {
  path: string[];
  param: any;
  result: string;
}

export interface PushErrorPayload {
  path: string[];
  param: any;
  error: string;
}

export const push = apiActionCreator<any, string>([ DATABASE_PUSH, DATABASE_PUSH_SUCCESS, DATABASE_PUSH_ERROR ], database.push);

export interface UpdatePayload {
  path: string[];
  param: any;
}

export interface UpdateSuccessPayload {
  path: string[];
  param: any;
  result: any;
}

export interface UpdateErrorPayload {
  path: string[];
  param: any;
  error: string;
}

export const update = apiActionCreator<any, any>([ DATABASE_PUSH, DATABASE_PUSH_SUCCESS, DATABASE_PUSH_ERROR ], database.update);