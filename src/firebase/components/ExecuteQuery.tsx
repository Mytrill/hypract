import { h, Component, FunctionalComponent } from 'preact';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { State } from '../../reducer';
import * as actions from '../actions';
import { queryStateSelector } from '../selectors';
import { Query, SingleQueryState } from '../types';
import { Data, DataOrArray, toString, toStringArray } from '../../data';
import { element, elements, wrap } from '../../element';

export interface ExecuteQueryProps {
  path: string[];
  query: Query;
}

export interface ExecuteQueryRawProps extends ExecuteQueryProps {
  exec(path: string[], query: Query): void;
  queryState?: SingleQueryState;
}

class ExecuteQueryRaw extends Component<ExecuteQueryRawProps, any> {

  componentDidMount() {
    this.props.exec(this.props.path, this.props.query);
  }

  render() {
    // do not pass exec down to children
    const { queryState, exec, children, ...rest } = this.props;

    // query not finished
    if(!queryState || !queryState.done) {
      return <div>Loading...</div>;
    }
    // query failed, the notification component will display
    if(!queryState.success) {
      return <div></div>;
    }
    // query succeeded
    return wrap(elements(children, rest));
  }
}

const mapStateToProps = (state: State, props: ExecuteQueryRawProps) => ({
  queryState: queryStateSelector(state, props.path, props.query)
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  exec: (path: string[], query: Query) => { dispatch<any>(actions.query(path, query)); }
});

export const ExecuteQuery: FunctionalComponent<ExecuteQueryProps> = connect(mapStateToProps, mapDispatchToProps)(ExecuteQueryRaw);
