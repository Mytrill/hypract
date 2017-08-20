import { h, Component } from 'preact';
import { Field as ReduxField } from 'redux-form';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import { ReduxFieldProps } from '../types';
import { createComponentConfFactory } from '../../utils';
import { ComponentProps, ComponentConf, PreactComponent } from '../../types';

export interface FormFieldConf {
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

export class FormField extends Component<ComponentProps<FormFieldConf>, any> {

  render() {
    const conf = this.props.conf;

    if(conf.type === 'boolean') {
      return <ReduxField name={conf.name} label={conf.label} component={renderCheckbox} />
    }

    const extra = {
      fullWidth: true,
      multiline: conf.type === 'text',
      rows: conf.type === 'text' ? 6 : undefined,
      type: conf.type === 'password' ? 'pasword' : 'text'
    };

    return <ReduxField name={conf.name} label={conf.label} component={renderTextField} props={extra} />;
  }
}

export const formField = createComponentConfFactory<FormFieldConf>(FormField);
