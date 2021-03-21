import { useRef } from "react";
import FormStore, { FormInstance } from "./FormStore";

const useForm = (form?: FormInstance) => {
  const formRef = useRef(form);

  if (!formRef.current) {
    if (form) {
      formRef.current = form;
    } else {
      const formStore = new FormStore();
      formRef.current = formStore.getForm();
    }
  }

  return [formRef.current];
};

export default useForm;
