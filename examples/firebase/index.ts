import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import { init, State as FirebaseState, reducer as FirebaseReducer, actions } from '../../src/firebase';
import { State, reducer, middlewares } from '../../src';

const store = createStore<State>(reducer, applyMiddleware(middlewares.thunk, middlewares.logger));


init({ databaseURL: 'https://learn-project-dev.firebaseio.com' });


store.dispatch(actions.push('subjects', { title: 'Subject 1' }));

setTimeout(() => {
  store.dispatch(actions.query('subjects', {}));
}, 250)

setTimeout(() => {
  store.dispatch(actions.push('subjects', { title: 'Subject 2' }));  
}, 500)


setTimeout(() => {
  const subjects = store.getState().firebase.database.subjects;
  const key = Object.keys(subjects)[0];
  store.dispatch(actions.update(['subjects', key], { title: 'Updated Subject 1' }));  
}, 750)


setTimeout(() => {
  const subjects = store.getState().firebase.database.subjects;
  const key = Object.keys(subjects)[1];
  store.dispatch(actions.update(['subjects', key], null));  
}, 1000)