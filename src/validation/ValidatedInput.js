import React from "react";
import { isErrorMessage } from "./Validated";
import {
  TextArea,
  AdvancedInput,
  Select,
  Label,
  LabeledCheckboxOrRadio,
  InputMessage
} from "../FormComponents";

function isCheckboxOrRadio(type) {
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
  ...rest
}) => {
  const showInputMessage = validationMessage && !isValidating;

  const status = isErrorMessage(validationMessage) ? "error" : "";
  const message =
    validationMessage && validationMessage.hint
      ? validationMessage.hint
      : validationMessage;

  function convertedType(type) {
    if (isCheckboxOrRadio(type)) {
      if (placeholder) {
        throw new Error(
          "'placeholder' prop is unsupported on checkbox or radio components"
        );
      }
      return LabeledCheckboxOrRadio;
    } else if (type === "textarea") {
      // Technically textarea is not an input type, but we'll pretend
      // The rationale is that it keeps the entire API slightly more consistent
      // TODO: make an AdvancedTextArea to handle valid state and loading
      return TextArea;
    } else if (type === "select") {
      return Select;
    }
    return AdvancedInput;
  }

  return (
    <div className={shouldShake ? "shake" : null}>
      {!isCheckboxOrRadio(type) && !placeholder && <Label>{label}</Label>}
      {React.createElement(convertedType(type), {
        status,
        placeholder,
        isValid,
        isValidating,
        "aria-invalid": !isValid,
        type,
        label,
        ...rest
      })}
      {showInputMessage && (
        <InputMessage status={status}>{message}</InputMessage>
      )}
    </div>
  );
};

export default ValidatedInput;
