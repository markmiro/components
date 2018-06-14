import React from "react";
import Validated from "./Validated";
import { shallow } from "enzyme";

it("renders without crashing", () => {
  shallow(
    <Validated
      validations={{
        bla: x => (x > 10 ? "" : "Error message")
      }}
      render={bla => <div>Hello</div>}
    />
  );
});
