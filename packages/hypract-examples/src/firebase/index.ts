import { createStore, applyMiddleware, combineReducers } from 'redux';

import { init, State as FirebaseState, reducer as FirebaseReducer, actions } from '../../src/firebase';
import { HypractState, hypractReducer } from '../../src/reducer';
import { logger, thunk } from '../../src/middlewares';


const store = createStore<HypractState>(hypractReducer(), applyMiddleware(thunk, logger));


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
