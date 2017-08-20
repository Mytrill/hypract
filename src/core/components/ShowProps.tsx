import { isBoolean } from 'lodash';
import { h, Component } from 'preact';
import { get } from 'dot-prop-immutable';

import { ComponentConf, ComponentProps, WithChildren, Data } from '../../types';
import { createComponentConfFactory, renderChildrenToElement, data } from '../../utils';

export interface ShowPropsConf extends WithChildren {
  title?: Data;
  path?: string | string[];
  hidden?: boolean;
}

export const ShowProps = (props: ComponentProps<ShowPropsConf>) => {
  if(props.conf.hidden) {
    return <div>{renderChildrenToElement(props)}</div>;
  }
  const path = props.conf.path;
  const title = data.toString(props.conf.title, props) || (path ? 'Props for path ' + path : 'Complete Props');
  const propsToShow = path ? get(props, path) : props;
  return (
    <div>
      <h3>{title}</h3>
      <pre>{JSON.stringify(propsToShow, null, 2)}</pre>
      {renderChildrenToElement(props)}
  </div>
  );
}

export const showProps = (conf: ShowPropsConf): ComponentConf & ShowPropsConf => ({ 
  renderer: ShowProps, 
  title: conf.title, 
  path: conf.path
});
