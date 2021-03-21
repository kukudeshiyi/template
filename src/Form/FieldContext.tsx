import React from "react";
import { FormInstance } from "./FormStore";

const warningFunc = () => {
  console.warn(
    "Can not find FormContext. Please make sure you wrap Field under Form."
  );
};

const FieldContext = React.createContext<FormInstance>({
  getFieldValue: warningFunc,
  getFieldsValue: warningFunc as FormInstance["getFieldsValue"],
  setFieldsValue: warningFunc,
  registerField: (filed) => {
    return () => {};
  },
});

export default FieldContext;
