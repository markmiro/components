import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { Welcome } from "@storybook/react/demo";
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
    ButtonGroupH
} from "../FormComponents";
import ResponsiveSelect, { ResponsiveOption } from "../ResponsiveSelect";
import ResizerParent from "../ResizerParent";
import CharacterWidthCalculator from "../CharacterWidthCalculator";
import "../index.css";
import Resume from "../Resume";
import Form from "../Form";
import SimpleForm1 from "../SimpleForm1";
import SimpleForm2 from "../SimpleForm2";
import SimpleForm3 from "../SimpleForm3";
import SimpleForm4 from "../SimpleForm4";
import SimpleForm5 from "../SimpleForm5";
import SimpleForm5b from "../SimpleForm5b";
import SimpleForm5c from "../SimpleForm5c";
import SimpleForm6a from "../SimpleForm6a";
import TransitionExample from "../TransitionExample";
import TransitionContentExample from "../TransitionContentExample";
import "../globals";

const Padded = story => <div style={{ padding: "2rem" }}>{story()}</div>;

storiesOf("Welcome", module).add("to Storybook", () => (
    <Welcome showApp={linkTo("Button")} />
));

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
                <Input className={elementStateClass} value={LOREM_TEXT} />
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
        <br />
        <div>
            <Label>Text Area</Label>
            <TextArea className={elementStateClass} value={LOREM_TEXT} />
        </div>
        <FinePrint>
            Lorem ipsum dolor sit amet, consectetur{" "}
            <a href="#">adipisicing elit</a>. Totam porro temporibus ullam,
            explicabo optio corporis sit repellat veniam atque fugiat
            consequatur nisi tempore, suscipit reprehenderit deserunt ipsum
            fugit, at aliquid!
        </FinePrint>
    </VerticalSpacer>
);

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

storiesOf("Animations", module)
    .add("TransitionExample", () => <TransitionExample />)
    .add("TransitionContentExample", () => <TransitionContentExample />);

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

storiesOf("Forms", module)
    .addDecorator(story => (
        <Fill>
            <PageCard>{story()}</PageCard>
        </Fill>
    ))
    .add("Form", () => <Form />)
    .add("Simple Form 1", () => <SimpleForm1 />)
    .add("Simple Form 2", () => <SimpleForm2 />)
    .add("SimpleForm3", () => <SimpleForm3 />)
    .add("SimpleForm4", () => <SimpleForm4 />)
    .add("SimpleForm5", () => <SimpleForm5 />)
    .add("SimpleForm5b", () => <SimpleForm5b />)
    .add("SimpleForm5c", () => <SimpleForm5c />)
    .add("SimpleForm6a", () => <SimpleForm6a />);

storiesOf("Responsive Select", module)
    .addDecorator(Padded)
    .add("Responsive Select", () => (
        <VerticalSpacer space="1em">
            <ResponsiveSelect value={1} useSelect onChange={() => {}}>
                <ResponsiveOption value={1}>OneOneOne</ResponsiveOption>
                <ResponsiveOption value={2}>TwoTwoTwo</ResponsiveOption>
                <ResponsiveOption value={3}>ThreeThreeThree</ResponsiveOption>
            </ResponsiveSelect>
            <ResponsiveSelect value={2} useSelect onChange={() => {}}>
                <ResponsiveOption value={1}>OneOneOne</ResponsiveOption>
                <ResponsiveOption value={2}>TwoTwoTwo</ResponsiveOption>
                <ResponsiveOption value={3}>ThreeThreeThree</ResponsiveOption>
            </ResponsiveSelect>
            <ResponsiveSelect value={1} onChange={() => {}}>
                <ResponsiveOption value={1}>OneOneOne</ResponsiveOption>
                <ResponsiveOption value={2}>TwoTwoTwo</ResponsiveOption>
                <ResponsiveOption value={3}>ThreeThreeThree</ResponsiveOption>
            </ResponsiveSelect>
            <ResponsiveSelect value={3} onChange={() => {}}>
                <ResponsiveOption value={1}>OneOneOne</ResponsiveOption>
                <ResponsiveOption value={2}>TwoTwoTwo</ResponsiveOption>
                <ResponsiveOption value={3}>ThreeThreeThree</ResponsiveOption>
            </ResponsiveSelect>
        </VerticalSpacer>
    ));

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
                    <Box width="10.1em">
                        The Kardashians continuously infiltrate it
                    </Box>
                    <br />
                    <Label>Small word in the middle</Label>
                    <Box width="6.3em">
                        Wonderbread<br />is magnificent
                    </Box>
                </VerticalSpacer>
                <VerticalSpacer space=".2em">
                    <Label>Lots of small words</Label>
                    <Box width="10.3em">
                        I can do it if you can&nbsp;do&nbsp;it
                    </Box>
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
                    <FinePrint>
                        Forcing a word to fit and hoping for the best
                    </FinePrint>
                    <br />
                    <Label>Small word in the middle</Label>
                    <Box width="6.3em" style={{ letterSpacing: "-0.2px" }}>
                        Wonderbread<br />is&nbsp;magnificent
                    </Box>
                    <FinePrint>
                        Changing letter-spacing to make a title fit
                    </FinePrint>
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

storiesOf("Resume", module).add("Basic", () => <Resume />);
