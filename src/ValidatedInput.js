import React from "react";
import { Input, Label, InputMessage } from "./FormComponents";

const ValidatedInput = ({
  label,
  errorMessage,
  placeholder,
  helper,
  ...props
}) => {
  const finalErrorMessage = helper ? helper.validationMessage : errorMessage;
  const finalProps = helper ? helper.getProps({ ...props }) : props;
  return (
    <div>
      {!placeholder && (
        <Label status={finalErrorMessage && "error"}>{label}</Label>
      )}
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
