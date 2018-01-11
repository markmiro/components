import React from "react";
import { ValidatedForm } from "./Validated3";
import validations from "./validations2";
import validator from "validator";
import { without } from "lodash";
import ValidatedInput from "./ValidatedInput";
import {
  ButtonSuperPrimary,
  Label,
  VerticalSpacer,
  InputMessage
} from "./FormComponents";

const isEmailUniqe = email =>
  new Promise(resolve =>
    setTimeout(
      () => resolve(email === "bla@bla.com" ? "Email exists" : ""),
      700
    )
  );

const shouldNotContainYourEmail = email => password =>
  password.includes(email) || email.includes(password)
    ? "Your password should not include any part of your email"
    : "";

class SimpleForm extends React.Component {
  state = { acceptedTerms: false };
  render = () => (
    <ValidatedForm
      validations={state => ({
        username: [validations.required, validations.name],
        email: [validations.required, ...validations.email, isEmailUniqe],
        confirmEmail: [
          validations.required,
          value => validations.confirmEmail(state.email, value)
        ],
        password: [
          value => [validations.required(value)],
          validations.password,
          value => [shouldNotContainYourEmail(state.email)(value)]
        ],
        acceptTerms: didAccept =>
          didAccept ? "" : "Please accept to the terms to continue"
      })}
      onSubmit={(fields, messages, isValid) =>
        isValid && alert(JSON.stringify(fields, null, "  "))
      }
      render={(
        { username, email, confirmEmail, password, acceptTerms },
        { isValidating }
      ) => (
        <VerticalSpacer
          space="1em"
          style={{
            opacity: isValidating ? 0.6 : 1
          }}
        >
          <h1>Create Account</h1>
          {username.watch(
            <ValidatedInput
              label="Username"
              errorMessage={username.validationMessage}
              {...username.customProps}
            />
          )}
          {email.watch(
            <ValidatedInput
              label="Email"
              errorMessage={email.validationMessage}
              {...email.customProps}
            />
          )}
          {confirmEmail.watch(
            <ValidatedInput
              label="Confirm Email"
              errorMessage={confirmEmail.validationMessage}
              {...confirmEmail.customProps}
            />
          )}
          {password.watch(
            <ValidatedInput
              label="Password"
              errorMessage={
                password.validationMessage &&
                password.validationMessage
                  .filter(message => !!message)
                  .map(message => <div key={message}>{message}</div>)
              }
              {...password.customProps}
            />
          )}
          <div className={acceptTerms.shouldShake ? "shake" : ""}>
            <Label style={{ marginBottom: 0 }}>
              <input
                type="checkbox"
                checked={this.state.acceptedTerms}
                onChange={e => {
                  acceptTerms.validateValue(e.target.checked);
                  this.setState({
                    acceptedTerms: e.target.checked
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
