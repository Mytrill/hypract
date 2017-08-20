import { h, Component } from 'preact';
import { isEqual } from 'lodash';

import { queryResults } from './QueryResults';
import { queryExecutor } from './QueryExecutor';
import { Query as FirebaseQuery, UnresolvedQuery } from '../types';
import { createComponentConfFactory, renderToElement, data } from '../../utils';
import { DataOrArray, ComponentProps, ComponentConf, PreactComponent, WithChildren } from '../../types';

export interface QueryConf extends WithChildren {
  path: DataOrArray;
  query?: UnresolvedQuery;
}

const resolveQuery = (query: UnresolvedQuery, props: any): FirebaseQuery => {
  if(!query) {
    return {};
  }

  return {
    equals: data.toString(query.equals, props),
    where: data.toStringArray(query.where, props)
  };
}

export class Query extends Component<ComponentProps<QueryConf>, any> {

  path: string[];
  query: FirebaseQuery;

  private resolveQuery(props: ComponentProps<QueryConf>): boolean {
    const path = data.toStringArray(props.conf.path, props);
    const query = resolveQuery(props.conf.query, props);

    const eq = isEqual(path, this.path) && isEqual(query, this.query);
    this.path = path;
    this.query = query;

    return !eq;
  }

  componentWillMount() {
    this.resolveQuery(this.props);
  }

  shouldComponentUpdate(nextProps: ComponentProps<QueryConf>, nextState: any) {
    return this.resolveQuery(nextProps);
  }

  render() {
    return renderToElement(queryExecutor({
      query: this.query,
      path: this.path,
      children: [
        queryResults({
          query: this.query,
          path: this.path,
          children: this.props.conf.children || this.props.children
        })
      ]
    }), this.props);
  }
}

export const query = createComponentConfFactory<QueryConf>(Query);
