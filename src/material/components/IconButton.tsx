import * as React from 'react';
import { Dispatch, Action } from 'redux';
import MuiIconButton from 'material-ui/IconButton';

export interface IconButtonProps {
  materialIconName?: string;
  tooltip?: string;
  dispatchOnClick?(props: any, state: any, e: React.MouseEvent<any>): Action;
}

export function IconButton(props: IconButtonProps, { store }) {
  const { materialIconName, tooltip, dispatchOnClick, ...rest } = props;

  const handleEvent = (e: React.MouseEvent<any>) => {
    if(!dispatchOnClick) {
      return;
    }
    const action = dispatchOnClick(props, store.getState(), e);
    if(action) {
      store.dispatch(action);
    }
  }

  return <MuiIconButton iconClassName="material-icons" tooltip={tooltip} onClick={handleEvent}>{materialIconName}</MuiIconButton>;
}