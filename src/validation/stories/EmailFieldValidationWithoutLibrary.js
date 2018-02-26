import React, { Component } from "react";
import { isEqual } from "lodash";
import {
  Input,
  Label,
  Select,
  ButtonPrimary,
  InputMessage,
  VerticalSpacer
} from "../../FormComponents";

// * Link errors with messages
// * Show message at one of these times
//   - After clicking submit
//   - After blurring
//   - While typing
// * Allow sharing validation between frontend and backend
// * Allow multiple validations to be applied easily
// * ALlow async validation
// * Validate for success if currently field is error but user is typing
// * Input masking
// * Have good default behavior

const validators = {
  empty: content => /^\s*$/.test(content),
  email: email => /\S+@\S+\.\S+/.test(email)
};

const invalidMessages = {
  email: email =>
    (validators.empty(email) && "Required") ||
    (!validators.email(email) && "Email is invalid") ||
    ""
};

const NO_ERRORS = {
  email: ""
};

export default class EmailFieldValidationWithoutLibrary extends Component {
  constructor(props) {
    super(props);
    this.state = { email: "", errors: NO_ERRORS };
  }

  render() {
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          debugger;
          const target = e.target;
          this.setState(
            {
              errors: {
                ...this.state.errors,
                email: invalidMessages.email(this.state.email)
              }
            },
            () => {
              if (isEqual(this.state.errors, NO_ERRORS)) {
                alert("hi");
              }
            }
          );
        }}
      >
        <Label status={this.state.errors.email && "error"}>Email</Label>
        <VerticalSpacer space=".5em">
          <Input
            value={this.state.email}
            className={this.state.errors.email && "invalid"}
            status={this.state.errors.email && "error"}
            onChange={e => {
              const email = e.target.value;
              this.setState({
                email,
                errors: {
                  ...this.state.errors,
                  email: this.state.errors.email
                    ? invalidMessages.email(email)
                    : ""
                }
              });
            }}
            onBlur={e => {
              const email = e.target.value;
              this.setState({
                email,
                errors: {
                  ...this.state.errors,
                  email: invalidMessages.email(email)
                }
              });
            }}
          />
          {this.state.errors.email && (
            <InputMessage status="error">
              {this.state.errors.email}
            </InputMessage>
          )}
          <ButtonPrimary type="submit">Submit</ButtonPrimary>
        </VerticalSpacer>
      </form>
    );
  }
}
