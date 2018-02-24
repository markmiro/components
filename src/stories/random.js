import React from "react";
import { storiesOf } from "@storybook/react";
import { VerticalSpacer, HSpacer, Label, FinePrint } from "../FormComponents";
import CharacterWidthCalculator from "../CharacterWidthCalculator";
import { Padded } from "./decorators";

const Box = ({ width, children, style, ...rest }) => (
  <h2
    {...rest}
    style={{
      ...style,
      background: "rgba(0,0,0,0.02)",
      outline: "1px solid rgba(0,0,0,0.1)",
      width
    }}
  >
    {children}
  </h2>
);

storiesOf("Text Layout", module)
  .addDecorator(Padded)
  .add("Size Calculator", () => (
    <VerticalSpacer space="2em">
      <h1>Text Wrapping</h1>

      <HSpacer space="2em">
        <VerticalSpacer space="0">
          <Label>Lots of small words</Label>
          <Box width="10.3em">I can do it if you can do it</Box>
          <br />
          <Label>Two-letter word at the end</Label>
          <Box width="10.1em">The Kardashians continuously infiltrate it</Box>
          <br />
          <Label>Small word in the middle</Label>
          <Box width="6.3em">
            Wonderbread<br />is magnificent
          </Box>
        </VerticalSpacer>
        <VerticalSpacer space=".2em">
          <Label>Lots of small words</Label>
          <Box width="10.3em">I can do it if you can&nbsp;do&nbsp;it</Box>
          <FinePrint>
            Add more weight to bottom of title by having 3 words
          </FinePrint>
          <br />
          <Label>Two-letter word at the end</Label>
          <Box width="10.1em">
            The Kardashians continuously infiltrate&nbsp;it
          </Box>
          <FinePrint>Removing orphan</FinePrint>
          <br />
          <Label>Two-letter word at the end</Label>
          <Box width="10.1em" style={{ hyphens: "auto" }}>
            The Kardashians continuously infiltrate&nbsp;it
          </Box>
          <FinePrint>Hyphenate</FinePrint>
          <br />
          <Label>Small word in the middle</Label>
          <Box width="6.3em">
            Wonderbread<br />is&nbsp;magnificent
          </Box>
          <FinePrint>Forcing a word to fit and hoping for the best</FinePrint>
          <br />
          <Label>Small word in the middle</Label>
          <Box width="6.3em" style={{ letterSpacing: "-0.2px" }}>
            Wonderbread<br />is&nbsp;magnificent
          </Box>
          <FinePrint>Changing letter-spacing to make a title fit</FinePrint>
        </VerticalSpacer>
      </HSpacer>

      <div
        style={{
          background: "rgba(0, 0, 0, 0.1)",
          width: 80
        }}
      >
        <h2>We do it</h2>
      </div>
      <CharacterWidthCalculator />
    </VerticalSpacer>
  ));
