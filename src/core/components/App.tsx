import { h, Component } from 'preact';

import { ComponentConf, ComponentProps, WithChildren, WithWrappers } from '../../types';
import { createComponentConfFactory, renderChildrenToElement } from '../../utils';

export interface AppConf extends WithChildren, WithWrappers {
  title: string;
}

export class App extends Component<ComponentProps<AppConf>, any> {
  
  setPageTitle() {
    document.title = this.props.conf.title;
  }

  componentDidMount() {
    this.setPageTitle();
  }

  componentDidUpdate() {
    this.setPageTitle();
  }

  render() {
    // console.log('App props: ' + JSON.stringify(props, null, 2));
    return renderChildrenToElement(this.props, { app: this.props.conf });
  }
}

export const app = createComponentConfFactory<AppConf>(App);
