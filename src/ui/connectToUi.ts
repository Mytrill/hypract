import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { setUiState } from './actions';
import { State } from '../reducer';
import { UiComponentState } from './reducer';
import { selectUiState } from './selectors';

export interface UiInternalState {
  path: string[]
}

export interface ConnectedOuterProps {
  _ui?: UiInternalState;
  name?: string;
}
type OuterProps = ConnectedOuterProps;

export interface ConnectedInnerProps<UI> extends ConnectedOuterProps {
  state: UI & UiComponentState;
  setInState(widget: string[], value: any, property?: string | string[], custom?: boolean);
}
type InnerProps<UI> = ConnectedInnerProps<UI>;

const getWidgetPath = (path: string[], name: string): string[] => {
  if(!path) {
    throw new Error('No path provided for the given Ui component');
  }
  return path.concat(name);
}

const mapStateToProps = (defaultName: string) => (state: State, ownProps: OuterProps) => ({
  state: selectUiState(state, ownProps._ui.path.concat(ownProps.name || defaultName))
});

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: OuterProps) => ({
  setInState: (widget: string[], value: any, property?: string | string[], custom?: boolean) => { 
    dispatch(setUiState({ widget, value, property, custom }));
  }
})

export const connectToUi = () => <UI, I extends InnerProps<UI> = InnerProps<UI>, O extends OuterProps = OuterProps>
      (child: React.ComponentClass<I> | React.SFC<I>): React.ComponentClass<O> => {
  return connect(mapStateToProps(child.constructor.name), mapDispatchToProps)(child as any) as React.ComponentClass<O>;
}
