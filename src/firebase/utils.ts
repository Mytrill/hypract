import { Dispatch } from 'redux';

import { Query } from './types';

export const apiActionCreator = <P, R> (types: string[], apiCall: (path: string, param: P) => Promise<R>, 
    cacheHit?: (state: any, path: string[], param: P) => boolean) => (path: string | string[], param: P) => {
  const firebasePath = toFirebasePath(path);
  const actionPath = toActionPath(path);

  return (dispatch: Dispatch<any>, getState: () => any) => {
    // call this BEFORE dispatching the next action, this way the cacheHit function may return
    // true if the operation is already in progress!
    const didHitCache = cacheHit && cacheHit(getState(), actionPath, param);
    dispatch({ type: types[0], payload: { path: actionPath, param } });

    if(didHitCache) {
      return;
    }

    apiCall(firebasePath, param)
    .then(result => {
      dispatch({ type: types[1], payload: { path: actionPath, param, result } });
    })
    .catch((error: Error) => {
      dispatch({type: types[2], payload: { path: actionPath, param, error: error.message }, error: true});
    })
  }
}

export const queryToString = (query: Query): string => {
  if(query.where && query.equals) {
    if(typeof query.where === 'string') {
      return `${query.where} = ${JSON.stringify(query.equals)}`;
    }
    return `${query.where.join('.')} = ${JSON.stringify(query.equals)}`;
  }
  return 'all';
}

// export const apiActionCreatorNoPayload = <R> (types: string[], apiCall: (path: string) => Promise<R>) => (path: string | string[]) => {
//   const firebasePath = toFirebasePath(path);
//   const actionPath = toActionPath(path);

//   return (dispatch: Dispatch<any>) => {
//     dispatch({ type: types[0], payload: { path } });

//     apiCall(firebasePath)
//     .then(result => {
//       dispatch({ type: types[1], payload: { path, result } });
//     })
//     .catch((error: Error) => {
//       dispatch({type: types[2], payload: { path: actionPath, error: error.message }, error: true});
//     })
//   }
// }

export const toFirebasePath = (path: string | string[]): string => {
  return (typeof path === 'string') ? path.replace('.', '/') : path.join('/');
}

const toActionPath = (path: string | string[]): string[] => {
  return (typeof path === 'string') ? path.split('.') : path;
}
