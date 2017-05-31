import { h, Component } from 'preact';
import { Snackbar } from 'preact-mdl';
import { Router } from 'preact-router';

import initialize from '../initialize';
import { Page } from './Page';
import { App as Config } from '../types';
import { AppContext } from './types';

export interface AppProps {
  app: Config;
}

export interface AppState {

}

export class App extends Component<AppProps, AppState> {
  
  snackbar;
  snackbarRef = c => {
    this.snackbar = c.base;
  }

  showMessage(message: string) {
    this.snackbar.MaterialSnackbar.showSnackbar({
      message,
      timeout: 2000,
    });
  }

  getChildContext(): AppContext {
    return {
      app: this.props.app,
      showMessage: this.showMessage.bind(this),
    };
  }

  render({ app }: AppProps) {
    initialize(app);

    const pages = app.pages || {};

    // later, order by priority or something
    const children = Object.keys(app.pages || {}).map(key => {
      const page = app.pages[key];
      page.name = page.name || key;

      // compute the path
      let path = '/';
      if(!page.index && page.path) {
        path += page.path.join('/');
      }

      return <Page path={path} config={page} />;
    });

    // TODO support this, i.e. render widgets...
    // if (app.config.layout instanceof FunctionalComponent) {
    //   return <app.config.layout>{routes}</app.config.layout>;
    // }

    return (
      <div>
        <Router>{children}</Router>
        <Snackbar ref={this.snackbarRef} />
      </div>
    );
  }
}
export default App;
