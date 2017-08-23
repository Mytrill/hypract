import { h, Component } from 'preact';
import { Field as ReduxField } from 'redux-form';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import { ReduxFieldProps } from '../types';
import { PreactComponent } from '../../types';

export interface FormFieldProps {
  name: string;
  label: string;
  type: 'string' | 'text' | 'boolean' | 'password';
}

const renderCheckbox = ({ input, onCheck, label }) => {
  return <Checkbox 
    label={label}
    checked={input.value ? true : false} 
    onCheck={(event, isInputChecked) => {
      input.onChange(isInputChecked);
      if (onCheck) {
        onCheck(isInputChecked);
      }
    }}
  />
};

const renderTextField = ({ input, label, hintText, meta: { touched, error }, ...custom }) =>(
  <TextField hintText={hintText} floatingLabelText={label} errorText={touched && error} {...input} {...custom} />
);

export const FormField = (props: FormFieldProps) => {
    const { type, name, label } = props;
    
    if(type === 'boolean') {
      return <ReduxField name={name} label={label} component={renderCheckbox} />
    }

    const extra = {
      fullWidth: true,
      multiline: type === 'text',
      rows: type === 'text' ? 6 : undefined,
      type: type === 'password' ? 'pasword' : 'text'
    };

    return <ReduxField name={name} label={label} component={renderTextField} props={extra} />;
}
