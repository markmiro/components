import React from "react";
import validator from "validator";
import { debounce } from "lodash";
import {
  Button,
  ButtonGroupH,
  ButtonSuperPrimary,
  Label,
  VerticalSpacer,
  InputMessage
} from "../../FormComponents";
import { trace } from "../../globals";
import { ValidatedForm } from "../Validated";
import validations from "../validations2";
import ValidatedInput from "../ValidatedInput";

const isEmailUnique = (email, cb) =>
  setTimeout(
    () => cb(trace(email) === "bla@bla.com" ? "Email exists" : ""),
    700
  );

const isEmailUniqueDebounced = debounce(isEmailUnique, 500);

class RegisterForm extends React.Component {
  state = {
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
        email: this.state.email
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
          {username.watchFull(<ValidatedInput label="Username" />)}
          {email.watchFull(
            <ValidatedInput
              label="Email"
              errorMessage={
                email.validationMessage || this.state.isEmailUniqueMessage
              }
              isValidating={this.state.isCheckingIfEmailUnique}
              onChange={e => {
                const email = e.target.value;
                this.setState({ email, isCheckingIfEmailUnique: true });
                isEmailUniqueDebounced(email, message => {
                  this.setState({
                    isEmailUniqueMessage: message,
                    isCheckingIfEmailUnique: false
                  });
                });
              }}
            />
          )}
          {confirmEmail.watchFull(<ValidatedInput label="Confirm Email" />)}
          {password.watchFull(
            <ValidatedInput
              label="Password"
              validationMessage={
                password.validationMessage &&
                password.validationMessage
                  .filter(message => !!message)
                  .map(message => <div key={message}>{message}</div>)
              }
            />
          )}
          {acceptTerms.watchFull(
            <ValidatedInput
              label="I accept the terms and conditions"
              type="checkbox"
              innerRef={acceptTerms.ref}
            />
          )}

          <ButtonSuperPrimary type="submit">Submit</ButtonSuperPrimary>
          <ButtonGroupH>
            <Button
              type="button"
              onClick={() => {
                this.setState({
                  email: "",
                  isEmailUniqueMessage: ""
                });
                reset();
              }}
            >
              Reset
            </Button>
            <Button
              type="button"
              onClick={() =>
                this.setState({
                  email: "something@something.com"
                })
              }
            >
              Autofill
            </Button>
          </ButtonGroupH>
        </VerticalSpacer>
      )}
    />
  );
}

export default RegisterForm;
