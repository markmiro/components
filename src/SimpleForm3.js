import React, { Component } from "react";
import {
  ButtonPrimary,
  VerticalSpacer,
  Label,
  Input,
  InputMessage
} from "./FormComponents";
import validations from "./validations";
import { ValidatedForm } from "./Validated";
import ValidatedInput from "./ValidatedInput";

const SimpleForm = () => (
  <ValidatedForm
    validations={{ name: validations.name, email: validations.email }}
    onSubmit={isValid => {
      alert(isValid ? "Success" : "Error");
    }}
    render={({ name, email, validateAll }) => (
      <VerticalSpacer space=".5em">
        <ValidatedInput label="Name" helper={name} />
        <ValidatedInput label="Email" helper={email} />
        <div>
          <Label status={email.validationMessage && "error"}>Email</Label>
          <Input
            status={email.validationMessage && "error"}
            {...email.getProps()}
          />
          {email.validationMessage && (
            <InputMessage status="error">
              {email.validationMessage}
            </InputMessage>
          )}
        </div>
        <ButtonPrimary type="submit">Submit</ButtonPrimary>
      </VerticalSpacer>
    )}
  />
);

export default SimpleForm;
