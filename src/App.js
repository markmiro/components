import React, { Component } from "react";
import RegisterForm from "./validation/stories/RegisterForm";
import { PageCard } from "./FormComponents";

class App extends Component {
  render() {
    return (
      <PageCard>
        <RegisterForm />
      </PageCard>
    );
  }
}

export default App;
