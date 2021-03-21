import React from 'react';
import Form from './Form';
import useForm from './useForm';
import { Button, Input } from 'antd';
import Field from './Field';

const FormTest = () => {
  const [form] = useForm();
  return (
    <Form form={form}>
      <Field name="test_name">
        <Input />
      </Field>
      <Button
        onClick={() => {
          console.log(form.getFieldsValue());
        }}
      >
        Check
      </Button>
    </Form>
  );
};

export default FormTest;
