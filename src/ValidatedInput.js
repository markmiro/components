import React from "react";
import {
  Input,
  AdvancedInput,
  Label,
  InputMessage,
  Loading
} from "./FormComponents";

const ValidatedInput = ({
  label,
  errorMessage,
  shouldShake,
  isValid,
  placeholder,
  helper,
  ...props
}) => {
  const finalErrorMessage = helper ? helper.validationMessage : errorMessage;
  const finalProps = helper ? helper.getProps({ ...props }) : props;
  // const shouldShakeFinal =
  //   helper && helper.shouldShake ? helper.shouldShake : shouldShake;
  const shouldShakeClass = shouldShake ? "shake" : null;
  return (
    <div className={shouldShakeClass}>
      {!placeholder && <Label>{label}</Label>}
      <AdvancedInput
        status={finalErrorMessage && "error"}
        placeholder={placeholder}
        isValid={isValid}
        {...finalProps}
      />
      {finalErrorMessage && (
        <InputMessage status="error">{finalErrorMessage}</InputMessage>
      )}
    </div>
  );
};

export default ValidatedInput;
