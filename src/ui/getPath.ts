
export const getPath = (widget: string[], property?: string | string[], custom?: boolean) => {
  return property ? 
  custom ? widget.concat(['_state', '_custom'], property) : widget.concat(['_state'], property)
  : widget.concat(['_state']);
}