import React from "react";
import { storiesOf } from "@storybook/react";

import { PageCard, Input } from "../../FormComponents";
import AnimatedRegisterForm from "./AnimatedRegisterForm";
import EmailFieldValidationWithoutLibrary from "./EmailFieldValidationWithoutLibrary";
import EmailFieldValidationHoc from "./EmailFieldValidationHoc";
import WithPretendBackend from "./WithPretendBackend";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import RadioOptions from "./RadioOptions";
import Validated from "../Validated";

storiesOf("Forms", module)
  .addDecorator(story => <PageCard>{story()}</PageCard>)
  .add("AnimatedRegisterForm", () => <AnimatedRegisterForm />)
  .add("EmailFieldValidationWithoutLibrary", () => (
    <EmailFieldValidationWithoutLibrary />
  ))
  .add("EmailFieldValidationHOC", () => <EmailFieldValidationHoc />)
  .add("WithPretendBackend", () => <WithPretendBackend />)
  .add("RegisterForm", () => <RegisterForm />)
  .add("LoginForm", () => <LoginForm />)
  .add("RadioOptions", () => <RadioOptions />)
  .add("refs on <input />", () => (
    <div>
      <Validated
        validations={{
          bla: () => "Error"
        }}
        render={({ bla }, { validateAll }) => (
          <form
            onSubmit={e => {
              e.preventDefault();
              validateAll();
            }}
          >
            {bla.watch(<input />)}
            {bla.validationMessage}
            <button type="submit">Submit</button>
          </form>
        )}
      />
      <Validated
        validations={{
          bla: () => "Error"
        }}
        render={({ bla }, { validateAll }) => (
          <form
            onSubmit={e => {
              e.preventDefault();
              validateAll();
            }}
          >
            {bla.watch(<Input />)}
            {bla.validationMessage}
            <button type="submit">Submit</button>
          </form>
        )}
      />
    </div>
  ));
