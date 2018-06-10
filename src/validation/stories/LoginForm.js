import React from "react";
import Validated from "../Validated";

import validations from "../validations2";

const LoginForm = () => (
  <Validated
    validations={{
      username: validations.required,
      password: validations.required
    }}
    render={(
      { username, password },
      { validateAll, setValidationMessages }
    ) => (
      <form
        onSubmit={e => {
          e.preventDefault();
          validateAll(({ username, password }, messages, isValid) => {
            if (isValid) {
              setTimeout(() => {
                const shouldLoginUser =
                  username === "admin" && password === "admin";
                alert(
                  shouldLoginUser ? "Success!" : "Credentials are incorrect!"
                );
              }, 800);
            }
          });
        }}
      >
        <label>
          Username
          {username.watch(<input type="text" />)}
          {username.validationMessage}
        </label>
        <br />
        <label>
          Password
          {password.watch(<input type="password" />)}
          {password.validationMessage}
        </label>
        <button type="submit">Log In</button>
      </form>
    )}
  />
);

export default LoginForm;
