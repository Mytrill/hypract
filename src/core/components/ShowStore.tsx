import { h, FunctionalComponent } from 'preact';
import { connect } from 'react-redux';
import { get } from 'dot-prop-immutable';

import { ComponentConf, ComponentProps, PreactComponent, WithChildren, Data } from '../../types';
import { createComponentConfFactory, renderChildrenToElement, data } from '../../utils';

export interface ShowStoreConf extends WithChildren {
  title?: Data;
  path?: string | string[];
  hidden?: boolean;
}

interface ShowStoreProps extends ComponentProps<ShowStoreConf> {
  state: any;
}

const showStoreRaw = (props: ShowStoreProps) => {
  const { conf, state } = props;
  if(conf.hidden) {
    return <div>{renderChildrenToElement(props)}</div>;
  }
  const title = data.toString(props.conf.title, props) || (props.conf.path ? 'State for path ' + props.conf.path : 'Complete State');
  delete props.state;
  return (
    <div>
      <h3>{title}</h3>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      {renderChildrenToElement(props)}
  </div>
  );
}

const mapStateToProps = (state, ownProps: ShowStoreProps) => ({
  state: ownProps.conf.path ? get(state, ownProps.conf.path): state,
});

export const ShowStore: FunctionalComponent<ComponentProps<ShowStoreConf>> = connect(mapStateToProps)(showStoreRaw);

export const showStore = (conf: ShowStoreConf): ComponentConf & ShowStoreConf => ({
  renderer: ShowStore,
  title: conf.title,
  path: conf.path
})