import React from "react";
import { storiesOf } from "@storybook/react";
import { Padded } from "./decorators";
import {
  Input,
  Label,
  Select,
  Button,
  ButtonPrimary,
  ButtonSuperPrimary,
  InputMessage,
  VerticalSpacer,
  HSpacer,
  FinePrint,
  Loading,
  Fill,
  PageCard,
  TextArea,
  Text,
  ButtonGroupV,
  ButtonGroupH,
  LabeledCheckboxOrRadio
} from "../FormComponents";

const LOREM_TEXT = "The quick brown fox jumped over the lazy dog. ".repeat(3);

const AllComponents = ({ scale = 1, elementStateClass }) => (
  <VerticalSpacer
    space=".5em"
    style={{ fontSize: `${scale * 100}%`, flexGrow: scale * 10 }}
  >
    <VerticalSpacer space="1em">
      <label>{(scale || "1") + "x scale"}</label>
      <br />
      <label>{(elementStateClass || "normal") + " state"}</label>
      <hr />
      <div>
        <Label className={elementStateClass}>First Name</Label>
        <Input
          className={elementStateClass}
          value={LOREM_TEXT}
          onChange={() => {}}
        />
        <InputMessage className={elementStateClass}>
          This is something
        </InputMessage>
      </div>
      <div>
        <Label status="error" className={elementStateClass}>
          First Name
        </Label>
        <Input
          status="error"
          className={elementStateClass}
          value={LOREM_TEXT}
          onChange={() => {}}
        />
        <InputMessage status="error" className={elementStateClass}>
          This is something
        </InputMessage>
      </div>
      <div>
        <Label status="warning" className={elementStateClass}>
          First Name
        </Label>
        <Input
          status="warning"
          className={elementStateClass}
          value={LOREM_TEXT}
          onChange={() => {}}
        />
        <InputMessage status="warning" className={elementStateClass}>
          This is something
        </InputMessage>
      </div>
      <div>
        <Label status="success" className={elementStateClass}>
          First Name
        </Label>
        <Input
          status="success"
          className={elementStateClass}
          value={LOREM_TEXT}
          onChange={() => {}}
        />
        <InputMessage status="success" className={elementStateClass}>
          This is something
        </InputMessage>
      </div>
    </VerticalSpacer>
    <br />
    <Loading />
    <br />
    <Button className={elementStateClass}>
      Register Account <Loading />
    </Button>
    <ButtonPrimary className={elementStateClass}>
      Register Account <Loading />
    </ButtonPrimary>
    <ButtonSuperPrimary className={elementStateClass}>
      Register Account <Loading />
    </ButtonSuperPrimary>
    <Select className={elementStateClass}>
      <option>One</option>
      <option>Two</option>
      <option>Three</option>
    </Select>
    <ButtonGroupH>
      <Button>One</Button>
      <Button className={elementStateClass}>Two</Button>
      <Button>Three</Button>
    </ButtonGroupH>
    <ButtonGroupV>
      <Button>One</Button>
      <Button className={elementStateClass}>Two</Button>
      <Button>Three</Button>
    </ButtonGroupV>
    <LabeledCheckboxOrRadio
      type="checkbox"
      label="One"
      className={elementStateClass}
    />
    <br />
    <LabeledCheckboxOrRadio
      type="radio"
      name="dos"
      label="Two"
      className={elementStateClass}
    />
    <br />
    <LabeledCheckboxOrRadio
      type="radio"
      name="dos"
      label="Three"
      className={elementStateClass}
    />
    <br />
    <div>
      <Label>Text Area</Label>
      <TextArea
        className={elementStateClass}
        value={LOREM_TEXT}
        onChange={() => {}}
      />
    </div>
    <FinePrint>
      Lorem ipsum dolor sit amet, consectetur <a href="#">adipisicing elit</a>.
      Totam porro temporibus ullam, explicabo optio corporis sit repellat veniam
      atque fugiat consequatur nisi tempore, suscipit reprehenderit deserunt
      ipsum fugit, at aliquid!
    </FinePrint>
  </VerticalSpacer>
);

storiesOf("All Components", module)
  .addDecorator(Padded)
  .add("Sizes", () => (
    <HSpacer space="2em">
      <AllComponents scale={0.75} />
      <AllComponents scale={1.0} />
      <AllComponents scale={1.25} />
    </HSpacer>
  ))
  .add("States", () => (
    <HSpacer space="2em">
      <AllComponents elementStateClass="disabled" />
      <AllComponents elementStateClass="" />
      <AllComponents elementStateClass="hover" />
      <AllComponents elementStateClass="focus" />
    </HSpacer>
  ));
