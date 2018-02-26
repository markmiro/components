import React from "react";
import ResponsiveSelect, { ResponsiveOption } from "../../ResponsiveSelect";
import { InputMessage } from "../../FormComponents";
import { ValidatedForm } from "../Validated";

class RadioOptions extends React.Component {
  render = () => (
    <div>
      <ValidatedForm
        validations={{ a: value => (value.bla === 2 ? "Invalid" : "") }}
        render={({ a }) => (
          <div>
            {a.watchFull(
              <ResponsiveSelect useRadio>
                <ResponsiveOption value={{ bla: 1 }}>
                  Valid 111
                </ResponsiveOption>
                <ResponsiveOption value={{ bla: 2 }}>
                  Invalid 222
                </ResponsiveOption>
                <ResponsiveOption value={{ bla: 3 }}>
                  Valid 333
                </ResponsiveOption>
              </ResponsiveSelect>
            )}
            <InputMessage status="error">{a.validationMessage}</InputMessage>
          </div>
        )}
      />
    </div>
  );
}

export default RadioOptions;
