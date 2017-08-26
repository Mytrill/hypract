import * as React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, createStore, Reducer, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { ReactElement } from './types';
import { thunk, logger } from './middlewares';
import { State, hypractReducer } from './reducer';

export interface HypractConf {
  appReducer?: Reducer<any>;
  useLogger?: boolean;
}

export const hypract = (App: ReactElement, { appReducer, useLogger }: HypractConf = {}) => {
  const reducer = combineReducers<State>({
    app: appReducer,
    hypract: hypractReducer
  })
  const store = createStore(reducer, useLogger ? applyMiddleware(thunk, logger) : applyMiddleware(thunk));
  render(
    <Provider store={store}>
      <MuiThemeProvider>
        {App}
      </MuiThemeProvider>
    </Provider>
  ,document.body);
}
