import { combineReducers } from 'redux';

import * as firebase from './firebase';
import * as form from './form';

export interface State {
  firebase: firebase.State;
  form: form.State;
}

export const reducer = combineReducers<State>({
  firebase: firebase.reducer,
  form: form.reducer,
});
