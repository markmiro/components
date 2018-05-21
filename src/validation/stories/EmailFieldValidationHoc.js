import React, { Component } from "react";
import {
  Input,
  Label,
  Select,
  ButtonPrimary,
  InputMessage,
  VerticalSpacer
} from "../../FormComponents";

/*
  This example shows how a simple form can be built without a library and with validation
  logic being separate from the UI. There are several problems that this example demonstrates:
  * There's a lot of code necessary to validate even though it's a form with one input
  * The code is brittle and very low-level
  * Imagine having to write unit tests for this logic for every form
  * Lots of plumbing

  Some nice things about this example:
  * UI layer is simple
  * Every layer of validation is separate. We have our validations, message, validation logic, and UI all separated
  * The code feels like it can be abstracted successfully
*/

const validators = {
  empty: content => /^\s*$/.test(content),
  email: email => /\S+@\S+\.\S+/.test(email)
};

const invalidEmailMessages = email =>
  (validators.empty(email) && "Required") ||
  (!validators.email(email) && "Email is invalid") ||
  "";

function emailFormContainer(Thing) {
  return class FormContainer extends Component {
    constructor(props) {
      super(props);
      this.state = { email: "", errors: "" };
      this.emailInput = React.createRef();
    }
    componentDidMount = () => {
      this.emailInput.current.focus();
    };
    onChange = e => {
      const email = e.target.value;
      this.setState({
        email,
        errors: this.state.errors ? invalidEmailMessages(email) : ""
      });
    };
    onBlur = e => {
      const email = e.target.value;
      this.setState({
        email,
        errors: invalidEmailMessages(email)
      });
    };
    onSubmit = e => {
      e.preventDefault();
      this.setState(
        {
          errors: invalidEmailMessages(this.state.email)
        },
        () => {
          if (this.state.errors === "") {
            alert("Submitted");
          } else {
            this.emailInput.current.focus();
          }
        }
      );
    };
    render = () => {
      return (
        <Thing
          email={this.state.email}
          errors={this.state.errors}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onSubmit={this.onSubmit}
          setRef={this.emailInput}
        />
      );
    };
  };
}

const Form = ({ email, errors, setRef, onChange, onBlur, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <Label status={errors && "error"}>Email</Label>
    <VerticalSpacer space=".5em">
      <Input
        value={email}
        status={errors && "error"}
        onChange={onChange}
        onBlur={onBlur}
        innerRef={setRef}
      />
      {errors && <InputMessage status="error">{errors}</InputMessage>}
      <ButtonPrimary type="submit">Submit</ButtonPrimary>
    </VerticalSpacer>
  </form>
);

export default emailFormContainer(Form);
