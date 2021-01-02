import React from "react";
import ReactDom from "react-dom";

class App extends React.Component {
  render() {
    return <div>App</div>;
  }
}

ReactDom.render(<App />, document.querySelector("#root"));
