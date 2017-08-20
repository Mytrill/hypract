import { h, Component } from 'preact';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { State } from '../../reducer';
import * as actions from '../actions';
import { queryStateSelector } from '../selectors';
import { Query, SingleQueryState } from '../types';
import { ComponentProps, WithChildren } from '../../types';
import { createComponentConfFactory, renderChildrenToElement } from '../../utils';

export interface QueryExecutorConf extends WithChildren {
  path: string[];
  query: Query;
}

interface QueryExecutorProps extends ComponentProps<QueryExecutorConf> {
  exec(path: string[], query: Query): void;
  queryState?: SingleQueryState;
}

class QueryExecutorRaw extends Component<QueryExecutorProps, any> {

  componentDidMount() {
    this.props.exec(this.props.conf.path, this.props.conf.query);
  }

  render() {
    const queryState = this.props.queryState;

    // query not finished
    if(!queryState || !queryState.done) {
      return <div>Loading...</div>;
    }
    // query failed, the notification component will display
    if(!queryState.success) {
      return <div></div>;
    }
    // query succeeded
    return renderChildrenToElement(this.props);
  }
}

const mapStateToProps = (state: State, props: QueryExecutorProps) => ({
  queryState: queryStateSelector(state, props.conf.path, props.conf.query)
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  exec: (path: string[], query: Query) => { dispatch<any>(actions.query(path, query)); }
});

export const QueryExecutor = connect(mapStateToProps, mapDispatchToProps)(QueryExecutorRaw);

export const queryExecutor = createComponentConfFactory<QueryExecutorConf>(QueryExecutor);