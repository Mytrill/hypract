import { h, render } from 'preact';

import AppComponent from './components/App';
import { App } from './types';

export const start = (app: App) => {
  render(<AppComponent app={app} />, document.body);
}
export default start;