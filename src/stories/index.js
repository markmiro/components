import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { Welcome } from "@storybook/react/demo";

import "../index.css";
import Resume from "../Resume";
// import TransitionExample from "../TransitionExample";
// import TransitionContentExample from "../TransitionContentExample";

import "../globals";
import "../validation/stories/validation-stories";
import "./elements";
import "./components";
import "./random";

storiesOf("Welcome", module).add("to Storybook", () => (
  <Welcome showApp={linkTo("Button")} />
));

// storiesOf("Animations", module)
//   .add("TransitionExample", () => <TransitionExample />)
//   .add("TransitionContentExample", () => <TransitionContentExample />);

storiesOf("Resume", module).add("Basic", () => <Resume />);
