// TODO think about that
import thunk from 'redux-thunk';
export { thunk };

/**
 * Logs all actions and states after they are dispatched.
 */
export const logger = store => next => action => {
  console.group(action.type);
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
}