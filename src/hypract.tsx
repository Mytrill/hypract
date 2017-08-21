import { h, render } from 'preact';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { ComponentConf } from './types';
import { renderToElement } from './utils';
import { thunk, logger } from './middlewares';
import { State, reducer } from './reducer';

export interface HypractConf {
  store?: any;
  props?: object;
  useLogger?: boolean;
}

export const hypract = (app: ComponentConf, { store, props, useLogger }: HypractConf = {}) => {
  const storeToUse = store ? store : createStore(reducer, useLogger ? applyMiddleware(thunk, logger) : applyMiddleware(thunk));
  render(
    <Provider store={store}>
      <MuiThemeProvider>
        {renderToElement(app, props)}
      </MuiThemeProvider>
    </Provider>
  ,document.body);
}
