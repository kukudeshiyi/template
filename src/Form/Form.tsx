import React from 'react';
import FieldContext from './FieldContext';
import useForm from './useForm';
import { FormInstance } from './FormStore';

interface PropsType {
  children: React.ReactElement[];
  form: FormInstance;
}
const Form: React.FC<PropsType> = (props: PropsType) => {
  const { children, form } = props;
  const [formInstance] = useForm(form);
  return (
    <FieldContext.Provider value={formInstance}>
      {children}
    </FieldContext.Provider>
  );
};

export default Form;
