import { isEqual } from 'lodash';
import { h, AnyComponent, Component as PreactComponent } from 'preact';
import { Spinner } from 'preact-mdl';
import { observer } from 'preact-mobx';

import renderComponent from '../renderComponent';
import { read, resolve } from '../storage';
import { AppContext } from './types';
import { resolveComponent, resolveEntity, resolveQuery } from '../utils';
import { SyncComponent as Config, ComponentProps as ComponentValues } from '../types';

// import { canResolvePath, getResolvedPath } from '../storage/pathUtils';

export interface ComponentProps {
  /** The configuration object for this component. */
  config: Config;
  /** Existing values. */
  props: ComponentValues;
}

export interface ComponentState {
  loading: boolean;
  queryResult?: any;
}

@observer
export class SyncComponent extends PreactComponent<ComponentProps, ComponentState> {

  resolvedQuery?: object = null;
  state = { loading: false };

  componentWillMount() {
    this.runQueryIfNecessary(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.runQueryIfNecessary(nextProps);
  }

  render(props: ComponentProps, state: ComponentState, context: AppContext) {
    const config = props.config;

    if(state.loading) {
      return <Spinner />;
    }

    const childProps = Object.assign({}, props.props);

    // add the results from the query, if any
    if(config.query && typeof state.queryResult !== 'undefined') {
      const targetProp = props.config.targetProp || 'value';
      childProps[targetProp] = state.queryResult;
    }

    // add extra props
    if(config.props) {
      Object.keys(config.props).forEach(key => {
        let val = config.props[key];
        if(typeof val === 'string' && val.startsWith(':')) {
          val = props.props[val.substr(1)];
          if(typeof val === 'undefined') {
            throw new Error('Cannot find ' + config.props[key] + ' in props.');
          }
        }

        childProps[key] = val;
      });
    }

    // render the component
    if(config.component) {
      const child = resolveComponent(config.component, context.app);
      return renderComponent(child, { props: childProps });
    }

    return <div>Component with props={JSON.stringify(props)}</div>;
  }

  runQueryIfNecessary(props: ComponentProps) {
    const context: AppContext = this.context;
    const config = props.config;
    if(!config.query) {
      return;
    }
    
    try {
      const query = resolveQuery(config.query, this.context.app);
      const resolved = resolve(this.context.app, query, props.props);

      // if the resolved query is the same as before, no need to rerun.
      if(this.resolvedQuery && isEqual(resolved, this.resolvedQuery)) {
        return;
      }

      this.setState({ loading: true, queryResult: undefined });

      // not the same (or first time we query), do the query.
      this.resolvedQuery = resolved;

      read(resolved)
      .then(result => {
        this.setState({ loading: false, queryResult: result });
      })
      .catch(error => {
        this.setState({ loading: false });
        console.log('Error while executing (resolved) query: ' + JSON.stringify(resolved) + '\nError: ' + JSON.stringify(error));
        context.showMessage('Error while trying to query data! Please refresh the page.');
      });
    } catch(e) {
      console.log('Error while resolving query ' + JSON.stringify(config.query) + ' Error: ' + JSON.stringify(e));
      context.showMessage('Error while trying to query data! Please refresh the page.');
      this.setState({ loading: false, queryResult: undefined });
    }
  }
}
export default SyncComponent;
