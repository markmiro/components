import React from "react";
import { storiesOf } from "@storybook/react";

import { PageCard } from "../../FormComponents";
import AnimatedRegisterForm from "./AnimatedRegisterForm";
import EmailFieldValidationWithoutLibrary from "./EmailFieldValidationWithoutLibrary";
import WithPretendBackend from "./WithPretendBackend";
import RegisterForm from "./RegisterForm";
import RadioOptions from "./RadioOptions";

storiesOf("Forms", module)
  .addDecorator(story => <PageCard>{story()}</PageCard>)
  .add("AnimatedRegisterForm", () => <AnimatedRegisterForm />)
  .add("EmailFieldValidationWithoutLibrary", () => (
    <EmailFieldValidationWithoutLibrary />
  ))
  .add("WithPretendBackend", () => <WithPretendBackend />)
  .add("RegisterForm", () => <RegisterForm />)
  .add("RadioOptions", () => <RadioOptions />);
