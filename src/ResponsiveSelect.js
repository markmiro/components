import React, { Component } from "react";
import { first, last, debounce } from "lodash";
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

export const ResponsiveOption = ({ children }) => <div>{children}</div>;

export default class ResponsiveSelect extends Component {
  state = {
    goVertical: true
  };

  checkSize = () => {
    if (!this.props.children) return;
    const allFit = Array.of(...this.buttonGroup.children).every(child => {
      const contentInsideTheButton = child.children[0];
      return (
        contentInsideTheButton.scrollWidth <= contentInsideTheButton.clientWidth
      );
    });
    this.setState({ goVertical: !allFit });
  };
  checkSizeDebounced = debounce(this.checkSize, 50);

  compo;

  componentDidMount() {
    this.checkSize();
    window.addEventListener("resize", this.checkSizeDebounced);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.checkSizeDebounced);
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
            <React.Fragment>
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
            </React.Fragment>
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
          role="radiogroup"
          style={goVertical ? hiddenStyles : {}}
        >
          {React.Children.map(children, child => {
            const isSelected =
              JSON.stringify(child.props.value) === JSON.stringify(value);
            return (
              <Button
                {...child.props}
                onClick={() => onChange(child.props.value)}
                tabindex={goVertical ? -1 : null}
                role="radio"
                aria-checked={isSelected}
                selected={isSelected}
              >
                <div style={{ whiteSpace: "nowrap" }}>
                  {child.props.children}
                </div>
              </Button>
            );
          })}
        </ButtonGroupH>
      </div>
    );
  }
}
