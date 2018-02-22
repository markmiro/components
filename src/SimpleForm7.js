import React from "react";
import { ValidatedForm } from "./Validated3";
import ValidatedInput from "./ValidatedInput";
import { RadioGroup } from "./FormComponents";

class SimpleForm7 extends React.Component {
  render = () => (
    <div>
      <ValidatedForm
        validations={{ a: () => {}, b: () => {} }}
        render={({ a, b }) => (
          <div>
            {a.watchFull(
              <ValidatedInput name="foobar" label="One" type="radio" />
            )}
            {b.watchFull(
              <ValidatedInput name="foobar" label="Two" type="radio" />
            )}
          </div>
        )}
      />
    </div>
  );
}

export default SimpleForm7;
