import React from "react";
import {
  Input,
  AdvancedInput,
  Label,
  LabeledCheckboxOrRadio,
  InputMessage,
  Loading
} from "../FormComponents";

function isCheckboxOrRadioType(type) {
  return type === "checkbox" || type === "radio";
}

// TODO: add unique id for labels
const ValidatedInput = ({
  label,
  type,
  validationMessage,
  shouldShake,
  isValid,
  isValidating,
  placeholder,
  helper,
  ...rest
}) => {
  const showInputMessage = validationMessage && !isValidating;
  return (
    <div className={shouldShake ? "shake" : null}>
      {!placeholder && !isCheckboxOrRadioType(type) && <Label>{label}</Label>}
      {!isCheckboxOrRadioType(type) && (
        <AdvancedInput
          status={validationMessage && "error"}
          placeholder={placeholder}
          isValid={isValid && !validationMessage}
          isValidating={isValidating}
          aria-invalid={showInputMessage}
          {...rest}
        />
      )}
      {isCheckboxOrRadioType(type) && (
        <LabeledCheckboxOrRadio type={type} label={label} {...rest} />
      )}
      {showInputMessage && (
        <InputMessage status="error">{validationMessage}</InputMessage>
      )}
    </div>
  );
};

export default ValidatedInput;
