
export interface ReduxInputFieldProps {
  name: string;
  value: any;
  checked?: boolean;
  onChange(e): void;
  onBlur(e): void;
  onDragStart(e): void;
  ondrop(e): void;
  onFocus(e): void;
}

export interface ReduxFieldProps {
  input: ReduxInputFieldProps;
}