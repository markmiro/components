import React, { Component } from "react";
import styled from "styled-components";
import { initial, last } from "lodash";
import { Motion, spring, presets } from "react-motion";
import chroma from "chroma-js";

const statusColor = (defaultColor, alpha = 1) => ({ status }) =>
  (status === "error" &&
    chroma("#f55280")
      .alpha(alpha)
      .css()) ||
  (status === "warning" &&
    chroma("#e8a538")
      .alpha(alpha)
      .css()) ||
  (status === "success" &&
    chroma("#5ad484")
      .alpha(alpha)
      .css()) ||
  defaultColor;

export const FinePrint = styled.p`
  font-size: 75%;
  color: rgba(0, 0, 0, 0.5);
`;

const FormControlBase = styled.input`
  padding: 0.6em 0.9em;
  font-size: inherit;
  border-width: 1px;
  border-style: solid;
  border-color: ${statusColor("#ccc")};
  border-radius: 0.2rem;
  background-color: transparent;
  background-clip: padding-box;
  width: 100%;
  display: block;
  line-height: 1.25;
  user-select: none;
  overflow: hidden;
  &:disabled,
  &.disabled {
    opacity: 0.65;
    pointer-events: none;
  }
  &:focus,
  &.focus {
    border-color: ${statusColor("#0054db80")} !important;
    box-shadow: inset 0px 2px 2px 0px ${statusColor("#2e7eff24", 0.14)},
      0px 0px 0px 2px ${statusColor("#2e5bff40", 0.25)};
  }
`;

const InputField = FormControlBase.extend`
  background: linear-gradient(#f4f4f4, white 0.2em);
  font-weight: 300;
  user-select: text;
  &:disabled,
  &.disabled {
    border-color: #ccc;
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

export const Input = InputField.withComponent("input");

export const TextArea = InputField.withComponent("textarea").extend`
    overflow: auto;
    resize: vertical;
`;

export const Label = styled.label`
  display: inline-block;
  margin-bottom: 0.5em;
  font-size: 85%;
  color: ${statusColor("rgba(0,0,0,0.7)")};
  letter-spacing: 0.01em;
  font-weight: 500;
  &:disabled,
  &.disabled {
    color: black;
    opacity: 0.5;
    pointer-events: none;
  }
`;

export const InputMessage = FinePrint.extend`
  color: ${statusColor("rgba(0,0,0,0.5)")};
  font-size: 75%;
  opacity: 1;
  margin-top: 0.5em;
  &:disabled,
  &.disabled {
    color: black;
    opacity: 0.5;
    pointer-events: none;
  }
`;

export const Button = FormControlBase.withComponent("button").extend`
	font-weight: 500;
	// animation: ${({ isSubmitting }) =>
    isSubmitting && "fade-out 1s ease-in-out infinite alternate"};
	// box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3), 0px 1px 9px rgba(0, 0, 0, 0.1);
	// background-image: linear-gradient(transparent 92%, #0000000f 95%);
	&:hover, &.hover {
		background-color: rgba(0, 0, 0, 0.03);
	}
	${({ selected }) =>
    selected && "background-image: linear-gradient(#ececec, #bbbbbb0a);"}
`;

export const Select = Button.withComponent("select").extend`
	height: 2.5em; // You can't set height with padding apparently
	background: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23333' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E") no-repeat right .75rem center;
	background-size: 8px 10px;
	padding-right: 20px;
	appearance: none;
	max-height: 100%;
	vertical-align: middle;
`;

export const ButtonPrimary = styled(Button)`
  border-color: transparent;
  background-color: #333;
  color: white;
  &:hover,
  &.hover {
    background-color: #000;
  }
`;

export const ButtonSuperPrimary = styled(ButtonPrimary)`
  background-color: hsl(217, 98%, 62%);
  &:hover,
  &.hover {
    background-color: hsl(217, 98%, 57%);
  }
`;

export const VerticalSpacer = styled.div`
  & > * + * {
    margin-top: ${({ space }) => space};
  }
`;

export const HSpacer = styled.div`
  display: flex;
  width: 100%;
  & > * + * {
    margin-left: ${({ space }) => space};
  }
`;

export class FadeOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      measuredWidth: 0,
      isMeasuring: true
    };
  }

  componentDidMount() {
    this.setState({
      measuredWidth: this.el.clientWidth,
      isMeasuring: false
    });
  }

  render() {
    const initialStylesForMeasuring = {
      position: "absolute",
      opacity: 0
    };
    const springConfig = { stiffness: 100, damping: 20 };
    const style = this.props.isVisible
      ? {
          opacity: spring(1, springConfig),
          width: spring(this.state.measuredWidth, springConfig)
        }
      : { opacity: spring(0, springConfig), width: spring(0, springConfig) };
    return (
      <Motion defaultStyle={{ opacity: 0, width: 0 }} style={style}>
        {interpolatedStyle => (
          <span
            style={
              this.state.isMeasuring
                ? initialStylesForMeasuring
                : { display: "inline-block", ...interpolatedStyle }
            }
            ref={el => {
              this.el = el;
            }}
          >
            {this.props.children}
          </span>
        )}
      </Motion>
    );
  }
}

export const Loading = ({ isVisible, style }) => (
  <span style={style}>
    <span
      style={{
        paddingLeft: "0",
        animation: "fade-out2 1000ms 0ms ease-in-out infinite"
      }}
    >
      •
    </span>
    <span
      style={{
        paddingLeft: "0.15em",
        animation: "fade-out2 1000ms 333ms ease-in-out infinite"
      }}
    >
      •
    </span>
    <span
      style={{
        paddingLeft: "0.15em",
        animation: "fade-out2 1000ms 667ms ease-in-out infinite"
      }}
    >
      •
    </span>
  </span>
);
Loading.defaultProps = {
  isVisible: true
};

export const Fill = styled.div`
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PageCard = styled.div`
  padding: 1.5em;
  width: 25em;
  // border-radius: 0.2em;
  // background: white;
  // box-shadow: 0px 2px 5px rgba(0,0,0,0.2), 0px 3px 40px 3px rgba(0,0,0,0.1);
`;

export const Text = ({ children }) => {
  if (typeof children !== "string") return children;
  const wordArr = children.split(" ");
  return [initial(wordArr).join(" "), <span>&nbsp;</span>, last(wordArr)];
};

const ButtonGroupAbstractBase = styled.div`
  display: flex;
  & > * {
    flex-grow: 1;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
  // Makes it so that focused item doesn't have borders betting cut off
  // by siblings
  & > *:focus,
  *.focus {
    z-index: 1;
  }
`;

export const ButtonGroupV = ButtonGroupAbstractBase.extend`
  flex-direction: column;
  & > * + * {
    margin-top: -1px;
  }
  & > *:first-child {
    border-top-left-radius: 0.2rem;
    border-top-right-radius: 0.2rem;
  }
  & > *:last-child {
    border-bottom-left-radius: 0.2rem;
    border-bottom-right-radius: 0.2rem;
  }
`;

export const ButtonGroupH = ButtonGroupAbstractBase.extend`
  & > * + * {
    margin-left: -1px;
  }
  & > *:first-child {
    border-bottom-left-radius: 0.2rem;
    border-top-left-radius: 0.2rem;
  }
  & > *:last-child {
    border-bottom-right-radius: 0.2rem;
    border-top-right-radius: 0.2rem;
  }
`;