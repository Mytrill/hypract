import { h, Component } from 'preact';
import { isEqual } from 'lodash';

import { QueryResults } from './QueryResults';
import { ExecuteQuery } from './ExecuteQuery';
import { Query as FirebaseQuery, UnresolvedQuery } from '../types';
import { Data, DataOrArray, toString, toStringArray } from '../../data';
import { element, elements, wrap } from '../../element';

export interface QueryProps {
  path: DataOrArray;
  query?: UnresolvedQuery;
}

const resolveQuery = (query: UnresolvedQuery, props: any): FirebaseQuery => {
  if(!query) {
    return {};
  }

  return {
    equals: toString(query.equals, props),
    where: toStringArray(query.where, props)
  };
}

export class Query extends Component<QueryProps, any> {

  path: string[];
  query: FirebaseQuery;

  private resolveQuery(props: QueryProps): boolean {
    const path = toStringArray(props.path, props);
    const query = resolveQuery(props.query, props);

    const eq = isEqual(path, this.path) && isEqual(query, this.query);
    this.path = path;
    this.query = query;

    return !eq;
  }

  componentWillMount() {
    this.resolveQuery(this.props);
  }

  shouldComponentUpdate(nextProps: QueryProps, nextState: any) {
    return this.resolveQuery(nextProps);
  }

  render() {
    // do not pass path and query down
    const { children, path, query, ...rest } = this.props;

    return (
      <ExecuteQuery path={this.path} query={this.query}>
        <QueryResults path={this.path} query={this.query}>
          {elements(children, rest)}
        </QueryResults>
      </ExecuteQuery>
    );
  }
}
