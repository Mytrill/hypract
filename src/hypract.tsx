import { h, render } from 'preact';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { ComponentConf } from './types';
import { renderToElement } from './utils';

export const hypract = (conf: ComponentConf, store?: any, props: object = {}) => {
  const Element = <MuiThemeProvider>{renderToElement(conf, props)}</MuiThemeProvider>;
  if(store) {
    render(<Provider store={store}>{Element}</Provider>, document.body);
  } else {
    render(Element, document.body);
  }
}
