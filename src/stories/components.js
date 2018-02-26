import React from "react";
import { storiesOf } from "@storybook/react";
import { Padded } from "./decorators";
import { VerticalSpacer } from "../FormComponents";
import ResponsiveSelect, { ResponsiveOption } from "../ResponsiveSelect";
import CodeEditor from "../CodeEditor";
import SideScroller from "../SideScroller";

class ResponsiveSelectExample extends React.Component {
  state = {
    value: 1
  };
  handleChange = newValue => this.setState({ value: newValue });
  render = () => (
    <VerticalSpacer space="1em">
      <ResponsiveSelect
        value={this.state.value}
        useSelect
        onChange={this.handleChange}
      >
        <ResponsiveOption value={1}>OneOneOne</ResponsiveOption>
        <ResponsiveOption value={2}>TwoTwoTwo</ResponsiveOption>
        <ResponsiveOption value={3}>ThreeThreeThree</ResponsiveOption>
      </ResponsiveSelect>
      <ResponsiveSelect value={this.state.value} onChange={this.handleChange}>
        <ResponsiveOption value={1}>OneOneOne</ResponsiveOption>
        <ResponsiveOption value={2}>TwoTwoTwo</ResponsiveOption>
        <ResponsiveOption value={3}>ThreeThreeThree</ResponsiveOption>
      </ResponsiveSelect>
      <ResponsiveSelect
        value={this.state.value}
        useRadio
        onChange={this.handleChange}
      >
        <ResponsiveOption value={1}>OneOneOne</ResponsiveOption>
        <ResponsiveOption value={2}>TwoTwoTwo</ResponsiveOption>
        <ResponsiveOption value={3}>ThreeThreeThree</ResponsiveOption>
      </ResponsiveSelect>
      <h1>Others</h1>
      <ResponsiveSelect
        value={this.state.value}
        useSelect
        onChange={this.handleChange}
      >
        <ResponsiveOption value={1}>OneOneOne</ResponsiveOption>
        <ResponsiveOption value={2}>TwoTwoTwo</ResponsiveOption>
        <ResponsiveOption value={3}>ThreeThreeThree</ResponsiveOption>
      </ResponsiveSelect>
      <ResponsiveSelect value={this.state.value} onChange={this.handleChange}>
        <ResponsiveOption value={1}>OneOneOne</ResponsiveOption>
        <ResponsiveOption value={2}>TwoTwoTwo</ResponsiveOption>
        <ResponsiveOption value={3}>ThreeThreeThree</ResponsiveOption>
      </ResponsiveSelect>
    </VerticalSpacer>
  );
}

storiesOf("Components", module)
  .addDecorator(Padded)
  .add("ResponsiveSelect", () => <ResponsiveSelectExample />);

storiesOf("CodeEditor", module).add("CodeEditor", () => <CodeEditor />);

storiesOf("SideScroller", module)
  .addDecorator(Padded)
  .add("SideScroller", () => (
    <div>
      <SideScroller />
      <div>
        Dolore irure Lorem magna ut anim et labore. Minim eiusmod ex voluptate
        enim pariatur consectetur. Dolore proident cillum laborum excepteur
        velit adipisicing reprehenderit do quis laborum id adipisicing labore
        exercitation. Adipisicing aute et ipsum mollit nulla. Consequat aute
        magna eiusmod adipisicing id dolore tempor nulla est in minim. Nulla
        aute velit nulla eu duis eiusmod nulla minim.
      </div>
    </div>
  ));
