import React from "react";
import { Input, Label, InputMessage } from "./FormComponents";

const ValidatedInput = ({
  label,
  errorMessage,
  shouldShake,
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
      <Input
        status={finalErrorMessage && "error"}
        placeholder={placeholder}
        {...finalProps}
      />
      {finalErrorMessage && (
        <InputMessage status="error">{finalErrorMessage}</InputMessage>
      )}
    </div>
  );
};

export default ValidatedInput;
