import React from "react";
import Validated from "../Validated";

const validations = {
  optionalUsername: input =>
    !input || input.length >= 2 ? "" : "Please enter at least two characters"
};

const OptionalInput = () => {
  return (
    <Validated
      validations={{
        username: validations.optionalUsername
      }}
      render={({ username }, { areAllValid }) => (
        <form
          onSubmit={e => {
            e.preventDefault();
            alert(areAllValid() ? "All valid" : "Please check your input");
          }}
        >
          <label>Username (optional): </label>
          {username.watch(<input />)}
          <p>{username.validationMessage}</p>
          <button type="submit">Submit</button>
        </form>
      )}
    />
  );
};

export default OptionalInput;
