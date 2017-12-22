import React, { Component } from "react";
import { first, last } from "lodash";
import { throttleEvent } from "./globals";
import { Select, Button, ButtonGroupH, ButtonGroupV } from "./FormComponents";

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

export const ResponsiveOption = ({ children, styles }) => <div>{children}</div>;

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
    const { useSelect, children, value, onChange } = this.props;
    const { goVertical } = this.state;
    return (
      <div>
        {goVertical &&
          useSelect && (
            <Select value={value} onChange={onChange}>
              {React.Children.map(children, child => (
                <option {...child.props} />
              ))}
            </Select>
          )}
        {goVertical &&
          !useSelect && (
            <ButtonGroupV>
              {React.Children.map(children, child => (
                <Button
                  {...child.props}
                  selected={child.props.value === value}
                />
              ))}
            </ButtonGroupV>
          )}
        <ButtonGroupH
          innerRef={el => {
            this.buttonGroup = el;
          }}
          style={goVertical ? hiddenStyles : {}}
        >
          {React.Children.map(children, child => (
            <Button {...child.props} selected={child.props.value === value} />
          ))}
        </ButtonGroupH>
      </div>
    );
  }
}
