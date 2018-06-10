import React from "react";
import { storiesOf } from "@storybook/react";

import { PageCard } from "../../FormComponents";
import AnimatedRegisterForm from "./AnimatedRegisterForm";
import EmailFieldValidationWithoutLibrary from "./EmailFieldValidationWithoutLibrary";
import EmailFieldValidationHoc from "./EmailFieldValidationHoc";
import WithPretendBackend from "./WithPretendBackend";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import RadioOptions from "./RadioOptions";

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
  .add("RadioOptions", () => <RadioOptions />);
