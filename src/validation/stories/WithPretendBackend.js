import React, { Component } from "react";
import { isEqual, noop } from "lodash";
import {
  Input,
  Label,
  Select,
  ButtonPrimary,
  InputMessage,
  VerticalSpacer
} from "../../FormComponents";
import validations from "../validations";
import Validated from "../Validated";
import ValidatedInput from "../ValidatedInput";
import { mapValues } from "lodash";

const addUser = ({ fName, email, confirmEmail }) => {
  debugger;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      email === "john@example.com"
        ? reject({ email: "This email is already registered" })
        : resolve();
    }, 700);
  });
};

class WithPretendBackend extends React.Component {
  state = {
    isSubmitting: false
  };
  render = () => (
    <Validated
      validations={state => ({
        fName: validations.fName,
        email: validations.email,
        confirmEmail: confirm => validations.confirmEmail(state.email, confirm)
      })}
      initialValues={{
        fName: "John",
        email: "john@example.com",
        confirmEmail: "john@example.com"
      }}
      render={(
        { fName, email, confirmEmail },
        { validateAll, areAllValid, setValidationMessages }
      ) => (
        <form
          onSubmit={e => {
            e.preventDefault();
            this.setState({ isSubmitting: true });
            validateAll((fields, messages, areAllValid) => {
              addUser({
                fName: fName.value,
                email: email.value,
                confirmEmail: confirmEmail.value
              })
                .then(() => alert("Success"))
                .catch(validationMessages => {
                  setValidationMessages(validationMessages);
                })
                .then(() => this.setState({ isSubmitting: false }));
            });
          }}
        >
          <VerticalSpacer space=".5em">
            {fName.watchFull(<ValidatedInput label="First name" />)}
            {email.watchFull(
              <ValidatedInput
                label="Email"
                onChange={e => confirmEmail.validateIfNonEmpty(e)}
              />
            )}
            {confirmEmail.watchFull(<ValidatedInput label="Confirm email" />)}
            {/* TODO: figure out what's going on with the submit being disabled before user inputs anything */}
            <ButtonPrimary
              type="submit"
              disabled={!areAllValid() || this.state.isSubmitting}
            >
              {this.state.isSubmitting ? "Submitting..." : "Submit"}
            </ButtonPrimary>
          </VerticalSpacer>
        </form>
      )}
    />
  );
}

export default WithPretendBackend;
