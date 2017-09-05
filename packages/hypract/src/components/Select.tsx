import React from 'react'

import { SelectorMap, wrap } from '../selectors'
import { ComponentProps } from '../types'
import { elements } from '../element'

export interface SelectProps {
  selectors: SelectorMap
  // TODO add dispatchs
}

const SelectRaw = ({ children, ...rest }: ComponentProps) => <div>{elements(children, rest)}</div>

export class Select extends React.Component<SelectProps> {
  Child?: React.ComponentType

  componentWillMount() {
    // for now, only on component mount
    this.Child = wrap(this.props.selectors)(SelectRaw)
  }

  render() {
    return <this.Child>{this.props.children}</this.Child>
  }
}
