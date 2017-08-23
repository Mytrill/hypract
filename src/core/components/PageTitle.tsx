import { h, Component } from 'preact';

import { Data, toString } from '../../data';

export interface PageTitle {
  title: Data;
}

export class PageTitle extends Component<PageTitle, any> {
  
  setPageTitle() {
    document.title = toString(this.props.title, this.props);
  }

  componentDidMount() {
    this.setPageTitle();
  }

  componentDidUpdate() {
    this.setPageTitle();
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}
