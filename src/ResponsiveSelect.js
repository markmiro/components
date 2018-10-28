import React, { Component } from "react";
import { first, last } from "lodash";
import { throttleEvent } from "./globals";
import {
  Select,
  Button,
  ButtonGroupH,
  ButtonGroupV,
  LabeledCheckboxOrRadio
} from "./FormComponents";

const hiddenStyles = {
  opacity: 0,
  height: 0,
  paddingTop: 0,
  paddingBottom: 0,
  marginTop: 0,
  marginBottom: 0,
  borderBottom: 0,
  borderTop: 0,
  transitionProperty: "none"
};

throttleEvent("resize", "optimizedResize");

export const ResponsiveOption = ({ children }) => <div>{children}</div>;

export default class ResponsiveSelect extends Component {
  state = {
    goVertical: true
  };

  checkSize = () => {
    if (!this.props.children) return;
    const allFit = Array.of(...this.buttonGroup.children).every(
      child => child.scrollWidth <= child.clientWidth
    );
    this.setState({ goVertical: !allFit });
  };

  componentDidMount() {
    window.addEventListener("optimizedResize", this.checkSize);
    this.checkSize();
  }

  componentWillUnmount() {
    window.removeEventListener("optimizedResize", this.checkSize);
  }

  render() {
    const { useSelect, useRadio, children, value, onChange } = this.props;
    const { goVertical } = this.state;
    return (
      <div>
        {goVertical &&
          useSelect && (
            <Select
              value={JSON.stringify(value)}
              onChange={e => {
                const childArray = React.Children.toArray(children);
                const child = childArray[e.target.selectedOptions[0].index];
                onChange(child.props.value);
              }}
            >
              {React.Children.map(children, child => (
                <option
                  {...child.props}
                  value={JSON.stringify(child.props.value)}
                />
              ))}
            </Select>
          )}
        {goVertical &&
          useRadio && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {React.Children.map(children, child => (
                <LabeledCheckboxOrRadio
                  type="radio"
                  label={child.props.children}
                  checked={
                    JSON.stringify(child.props.value) === JSON.stringify(value)
                  }
                  onChange={e =>
                    e.target.checked && onChange(child.props.value)
                  }
                />
              ))}
            </div>
          )}
        {goVertical &&
          !useSelect &&
          !useRadio && (
            <ButtonGroupV>
              {React.Children.map(children, child => (
                <Button
                  {...child.props}
                  onClick={() => onChange(child.props.value)}
                  selected={
                    JSON.stringify(child.props.value) === JSON.stringify(value)
                  }
                />
              ))}
            </ButtonGroupV>
          )}
        <ButtonGroupH
          ref={el => {
            this.buttonGroup = el;
          }}
          style={goVertical ? hiddenStyles : {}}
        >
          {React.Children.map(children, child => (
            <Button
              {...child.props}
              onClick={() => onChange(child.props.value)}
              selected={
                JSON.stringify(child.props.value) === JSON.stringify(value)
              }
            />
          ))}
        </ButtonGroupH>
      </div>
    );
  }
}
