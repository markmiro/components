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
import {
  normalizeValidations,
  validate,
  validateAll,
  validateAllWithPromises,
  validateWithPromises
} from "./Validated2";
import { traceFunc } from "./globals";

const isEmailUniqe = email =>
  new Promise(resolve =>
    setTimeout(
      () => resolve(email === "bla@bla.com" ? "Email exists" : ""),
      1500
    )
  );

class SimpleForm extends React.Component {
  state = { acceptedTerms: false };
  render = () => (
    <ValidatedForm
      validations={{
        username: [validations.required, validations.name],
        email: [validations.required, ...validations.email, isEmailUniqe],
        password: [
          value => [validations.required(value)],
          validations.password
        ],
        acceptTerms: didAccept =>
          didAccept ? "" : "Please accept to the terms to continue"
      }}
      onSubmit={(fields, messages, isValid) =>
        JSON.stringify(fields, null, "  ")
      }
      render={({ username, email, password, acceptTerms }) => (
        <VerticalSpacer space="1em">
          <h1>Create Account</h1>
          {username.watch(
            <ValidatedInput
              label="Username"
              errorMessage={username.validationMessage}
              shouldShake={username.shouldShake}
            />
          )}
          {email.watch(
            <ValidatedInput
              label="Email"
              errorMessage={email.validationMessage}
              shouldShake={email.shouldShake}
            />
          )}
          <ValidatedInput label="Confirm Email" />
          {password.watch(
            <ValidatedInput
              label="Password"
              errorMessage={
                password.validationMessage &&
                password.validationMessage
                  .filter(message => !!message)
                  .map(message => <div key={message}>{message}</div>)
              }
              shouldShake={password.shouldShake}
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
