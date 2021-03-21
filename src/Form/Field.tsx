import React, { ChangeEvent } from 'react';
import FieldContext from './FieldContext';

interface PropsType {
  name?: string;
}

export default class Field extends React.Component<PropsType> {
  private cancelRegister: (() => void) | undefined;
  public static contextType = FieldContext;

  constructor(props: PropsType) {
    super(props);
    this.cancelRegister;
  }

  componentDidMount = () => {
    this.cancelRegister = this.context.registerField(this);
  };

  componentDidUnMount = () => {
    this.cancelRegister && this.cancelRegister();
  };

  handleProps = () => {
    const { name } = this.props;
    const { getFieldValue, setFieldsValue } = this.context;
    return {
      value: getFieldValue(name),
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        if (e && e.target && name) {
          setFieldsValue({
            [name]: e.target.value,
          });
          console.log(name, 'value change', e?.target?.value);
        }
      },
    };
  };

  onStoreChange = () => {
    this.forceUpdate();
  };

  render() {
    const { children } = this.props;
    return (
      <>
        {React.cloneElement(children as React.ReactElement, this.handleProps())}
      </>
    );
  }
}
