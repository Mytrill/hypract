import { isBoolean } from 'lodash';
import { h, Component, ComponentProps } from 'preact';
import { get } from 'dot-prop-immutable';

import { Data, toString } from '../../data';
import { element, elements, wrap } from '../../element';

export interface ShowPropsProps {
  title?: Data;
  path?: string | string[];
  hidden?: boolean;
}

export const ShowProps = (props: ShowPropsProps & ComponentProps<any>) => {
  const { hidden, title, path, children, ...rest } = props;
  if(hidden) {
    return wrap(elements(children, rest));
  }
  const titleResolved = toString(title, props) || (path ? 'Props for path ' + path : 'Complete Props');
  const propsToShow = path ? get(props, path) : props;
  return (
    <div>
      <h3>{titleResolved}</h3>
      <pre>{JSON.stringify(propsToShow, null, 2)}</pre>
      {wrap(elements(children, rest))}
  </div>
  );
}
