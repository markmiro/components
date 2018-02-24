import React from "react";
import { storiesOf } from "@storybook/react";

import { PageCard } from "../FormComponents";
import Form from "../Form";
import SimpleForm1 from "../SimpleForm1";
import SimpleForm2 from "../SimpleForm2";
import SimpleForm3 from "../SimpleForm3";
import SimpleForm4 from "../SimpleForm4";
// import SimpleForm5 from "../SimpleForm5";
// import SimpleForm5b from "../SimpleForm5b";
// import SimpleForm5c from "../SimpleForm5c";
import SimpleForm6a from "../SimpleForm6a";
import SimpleForm7 from "../SimpleForm7";

storiesOf("Forms", module)
  .addDecorator(story => <PageCard>{story()}</PageCard>)
  .add("Form", () => <Form />)
  .add("Simple Form 1", () => <SimpleForm1 />)
  .add("Simple Form 2", () => <SimpleForm2 />)
  .add("SimpleForm3", () => <SimpleForm3 />)
  .add("SimpleForm4", () => <SimpleForm4 />)
  // .add("SimpleForm5", () => <SimpleForm5 />)
  // .add("SimpleForm5b", () => <SimpleForm5b />)
  // .add("SimpleForm5c", () => <SimpleForm5c />)
  .add("SimpleForm6a", () => <SimpleForm6a />)
  .add("SimpleForm7", () => <SimpleForm7 />);
