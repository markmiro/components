import React from "react";
import { ValidatedForm } from "./Validated3";
import ResponsiveSelect, { ResponsiveOption } from "./ResponsiveSelect";
import { InputMessage } from "./FormComponents";

class SimpleForm7 extends React.Component {
  render = () => (
    <div>
      <ValidatedForm
        validations={{ a: value => (value === "3" ? "Invalid" : "") }}
        render={({ a }) => (
          <div>
            {a.watchFull(
              <ResponsiveSelect useRadio>
                <ResponsiveOption value="1">AAAAAAAA</ResponsiveOption>
                <ResponsiveOption value="2">BBBBBBBB</ResponsiveOption>
                <ResponsiveOption value="3">CCCCCCCC</ResponsiveOption>
              </ResponsiveSelect>
            )}
            <InputMessage status="error">{a.validationMessage}</InputMessage>
          </div>
        )}
      />
    </div>
  );
}

export default SimpleForm7;
