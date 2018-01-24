import React from "react";
import { ValidatedForm } from "./Validated3";
import validations from "./validations2";
import validator from "validator";
import { debounce } from "lodash";
import ValidatedInput from "./ValidatedInput";
import {
  ButtonSuperPrimary,
  Label,
  VerticalSpacer,
  InputMessage
} from "./FormComponents";
import { trace } from "./globals";

const isEmailUnique = (email, cb) =>
  setTimeout(
    () => cb(trace(email) === "bla@bla.com" ? "Email exists" : ""),
    700
  );

const isEmailUniqueDebounced = debounce(isEmailUnique, 500);

class SimpleForm extends React.Component {
  state = {
    username: "",
    acceptTerms: false,
    email: "",
    isCheckingIfEmailUnique: false,
    isEmailUniqueMessage: ""
  };
  render = () => (
    <ValidatedForm
      validations={state => ({
        username: [validations.required, validations.name],
        email: [validations.required, ...validations.email],
        confirmEmail: [
          validations.required,
          value => validations.confirmEmail(state.email, value)
        ],
        password: [
          value => [validations.required(value)],
          validations.password
        ],
        acceptTerms: didAccept =>
          didAccept ? "" : "Please accept to the terms to continue"
      })}
      controlledValues={{
        username: this.state.username,
        email: this.state.email,
        acceptTerms: this.state.acceptTerms
      }}
      onSubmit={(fields, messages, isValid) =>
        isValid && alert(JSON.stringify(fields, null, "  "))
      }
      render={(
        { username, email, confirmEmail, password, acceptTerms },
        { reset }
      ) => (
        <VerticalSpacer space="1em">
          <h1>Create Account</h1>
          {username.watchFull(
            <ValidatedInput
              label="Username"
              onChange={e => this.setState({ username: e.target.value })}
              errorMessage={username.validationMessage}
            />
          )}
          {email.watchFull(
            <ValidatedInput
              label="Email"
              errorMessage={
                email.validationMessage || this.state.isEmailUniqueMessage
              }
              onChange={e => {
                const email = e.target.value;
                this.setState({ email });
                isEmailUniqueDebounced(email, message => {
                  this.setState({ isEmailUniqueMessage: message });
                });
              }}
            />
          )}
          {confirmEmail.watchFull(
            <ValidatedInput
              label="Confirm Email"
              errorMessage={confirmEmail.validationMessage}
            />
          )}
          {password.watchFull(
            <ValidatedInput
              label="Password"
              errorMessage={
                password.validationMessage &&
                password.validationMessage
                  .filter(message => !!message)
                  .map(message => <div key={message}>{message}</div>)
              }
            />
          )}
          <div className={acceptTerms.shouldShake ? "shake" : ""}>
            <Label style={{ marginBottom: 0 }}>
              <input
                type="checkbox"
                checked={this.state.acceptTerms}
                onChange={e => {
                  acceptTerms.validateValue(e.target.checked);
                  this.setState({
                    acceptTerms: e.target.checked
                  });
                }}
                ref={acceptTerms.ref}
              />
              <span style={{ marginLeft: ".5em" }}>
                I accept the terms and conditions
              </span>
            </Label>
            {acceptTerms.validationMessage && (
              <InputMessage status="error">
                {acceptTerms.validationMessage}
              </InputMessage>
            )}
          </div>

          <ButtonSuperPrimary type="submit">Submit</ButtonSuperPrimary>
        </VerticalSpacer>
      )}
    />
  );
}

export default SimpleForm;
