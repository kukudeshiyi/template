import React from "react";
interface PropsType {}

interface StateType {}
export default class App extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
  }
  render() {
    return <div>ABCD</div>;
  }
}
