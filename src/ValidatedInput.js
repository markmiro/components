import React from "react";
import {
  Input,
  AdvancedInput,
  Label,
  LabeledCheckboxOrRadio,
  InputMessage,
  Loading
} from "./FormComponents";

function isCheckboxOrRadioType(type) {
  return type === "checkbox" || type === "radio";
}

// TODO: add unique id for labels
const ValidatedInput = ({
  label,
  type,
  errorMessage,
  validationMessage,
  shouldShake,
  isValid,
  isValidating,
  placeholder,
  helper,
  ...rest
}) => {
  validationMessage = validationMessage ? validationMessage : errorMessage;
  return (
    <div className={shouldShake ? "shake" : null}>
      {!placeholder && !isCheckboxOrRadioType(type) && <Label>{label}</Label>}
      {!isCheckboxOrRadioType(type) && (
        <AdvancedInput
          status={validationMessage && "error"}
          placeholder={placeholder}
          isValid={isValid && !validationMessage}
          isValidating={isValidating}
          {...rest}
        />
      )}
      {isCheckboxOrRadioType(type) && (
        <LabeledCheckboxOrRadio type={type} label={label} {...rest} />
      )}
      {validationMessage &&
        !isValidating && (
          <InputMessage status="error">{validationMessage}</InputMessage>
        )}
    </div>
  );
};

export default ValidatedInput;
