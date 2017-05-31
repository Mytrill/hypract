import { h, AnyComponent, Component as PreactComponent } from 'preact';

import renderComponent from '../renderComponent';
import { Page as Config, Component} from '../types';
import { resolveComponent } from '../utils';
import { AppContext } from './types';


export interface PageProps {
  /** The resolved path. */
  path: string;
  /** The configuration object for this page. */
  config: Config;
  /** The matches. */
  matches?: object;
}

export interface PageState {

}

export class Page extends PreactComponent<PageProps, PageState> {

  setPageTitle() {
    const appTitle = this.context.app.config.title;
    if(this.props.config && this.props.config.title) {
      document.title = this.props.config.title.replace(':app', appTitle);
    } else {
      document.title = appTitle;
    }
  }

  componentDidMount() {
    this.setPageTitle();
  }

  componentDidUpdate() {
    this.setPageTitle();
  }

  render({ path, config, ...props }: PageProps, state: PageState, context: AppContext) {

    if(config.render) {
      return <config.render {...this.props} />;
    }

    if(config.components) {
      // set the values to pass to the components from the url parameters.
      const values = Object.assign({}, this.props.matches);

      if(config.components.length === 1) {
        const component: Component = resolveComponent<Component>(config.components[0], context.app);
        return renderComponent(component, { props: values });
      } else {
        const children = config.components.map(comp => {
          const component: Component = resolveComponent<Component>(comp, context.app);
          // console.log('Rendering component: ' + JSON.stringify(component));
          return renderComponent(component, { props: values });
        });
        return <div>{children}</div>;
      }
    }

    return <div>Rendering page with props: {JSON.stringify(this.props)}</div>;
  }
}
export default Page;
