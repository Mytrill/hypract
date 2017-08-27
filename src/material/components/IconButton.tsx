import * as React from 'react';
import { Dispatch, Store } from 'redux';
import MuiIconButton from 'material-ui/IconButton';

import { Action, ActionFactory, actionToHandler } from '../../actions';

export interface IconButtonProps {
  materialIconName?: string;
  tooltip?: string;
  style?: React.CSSProperties
  onClick?: ActionFactory | Action;
}

export function IconButton(props: IconButtonProps, { store }) {
  const { materialIconName, tooltip, onClick, style, ...rest } = props;
  return (
    <MuiIconButton iconClassName="material-icons" tooltip={tooltip} onClick={actionToHandler(onClick, props, store)} style={style}>
      {materialIconName}
    </MuiIconButton>
  );
}