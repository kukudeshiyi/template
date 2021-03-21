import Field from './Field';
import Form from './Form';

export interface Store {
  [key: string]: any;
}
export interface FormInstance {
  getFieldValue: (name: string) => any;
  getFieldsValue: () => Store;
  setFieldsValue: (newstore: Store) => void;
  registerField: (field: Field) => Function;
}
export default class FormStore {
  private store: Store = {};
  private fields: Field[] = [];

  getFields = (pure: boolean = false) => {
    if (!pure) {
      return this.fields;
    }
    return this.fields.filter((field) => field.props.name);
  };

  getFieldValue = (name: string) => this.store[name];
  getFieldsValue = () => {
    return this.store;
  };
  setFieldsValue = (newValues: Store) => {
    this.store = {
      ...this.store,
      ...newValues,
    };

    this.getFields(true).forEach(({ props, onStoreChange }) => {
      const name = props.name;
      Object.keys(newValues).forEach((item) => {
        if (item === name) {
          onStoreChange();
        }
      });
    });
  };

  registerField = (field: Field) => {
    this.fields.push(field);
    return () => {
      this.fields = this.fields.filter((item) => item !== field);
    };
  };
  getForm = () => {
    return {
      getFieldValue: this.getFieldValue,
      getFieldsValue: this.getFieldsValue,
      setFieldsValue: this.setFieldsValue,
      registerField: this.registerField,
    };
  };
}
