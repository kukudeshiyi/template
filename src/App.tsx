import React from 'react';
import { FormTest } from './Form';
import ErrorBoundary from './components/errorBoundary';
interface PropsType {}

interface StateType {}
export default class App extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
  }
  render() {
    return (
      <ErrorBoundary>
        <FormTest />
      </ErrorBoundary>
    );
  }
}
