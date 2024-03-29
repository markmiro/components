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
import OptionalInput from "./OptionalInput";
import NoteForm from "./NoteForm";
import Validated from "../Validated";
import { NestingContext } from "../../smart-components/SmartComponents";

storiesOf("Forms", module)
  .addDecorator(story => (
    <PageCard>
      <NestingContext.Provider value={3}>{story()}</NestingContext.Provider>
    </PageCard>
  ))
  .add("AnimatedRegisterForm", () => <AnimatedRegisterForm />)
  .add("EmailFieldValidationWithoutLibrary", () => (
    <EmailFieldValidationWithoutLibrary />
  ))
  .add("EmailFieldValidationHOC", () => <EmailFieldValidationHoc />)
  .add("WithPretendBackend", () => <WithPretendBackend />)
  .add("RegisterForm", () => <RegisterForm />)
  .add("OptionalInput", () => <OptionalInput />)
  .add("LoginForm", () => <LoginForm />)
  .add("RadioOptions", () => <RadioOptions />)
  .add("NoteForm", () => <NoteForm />)
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
