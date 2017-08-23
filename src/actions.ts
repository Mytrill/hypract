
export interface Action<P> {
  type: string;
  payload: P;
  error?: boolean;  
}

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
