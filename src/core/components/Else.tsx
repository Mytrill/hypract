import * as React from 'react';

import { ComponentProps } from '../../types';

export interface ElseProps {

}

export const Else = ({ children }: ElseProps & ComponentProps) => {
  return <div>{children}</div>;
}