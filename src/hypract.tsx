import * as React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { thunk, logger } from './middlewares';
import { State, reducer } from './reducer';

export interface HypractConf {
  store?: any;
  useLogger?: boolean;
}

export const hypract = (App: JSX.Element, { store, useLogger }: HypractConf = {}) => {
  const storeToUse = store ? store : createStore(reducer, useLogger ? applyMiddleware(thunk, logger) : applyMiddleware(thunk));
  render(
    <Provider store={storeToUse}>
      <MuiThemeProvider>
        {App}
      </MuiThemeProvider>
    </Provider>
  ,document.body);
}
