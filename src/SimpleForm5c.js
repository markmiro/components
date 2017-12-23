import React from "react";
import { ValidatedForm } from "./Validated";
import "bootstrap/dist/css/bootstrap.css";

const isValidUsernameTest = value => /^[0-9a-z]+$/.test(value);

const isRequired = value => (value === "" ? "Required" : "");
const isValidUsername = value =>
  isValidUsernameTest(value)
    ? ""
    : "Only lowercase letters and numbers allowed";
const isValidPassword = [
  value => (/[0-9]/.test(value) ? "" : "Please include a number"),
  value => (/[A-Z]/.test(value) ? "" : "Please include a captital letter")
];

class SimpleForm extends React.Component {
  state = {
    username: "",
    usernameMasking: "",
    password: ""
  };
  render = () => (
    <ValidatedForm
      validations={{
        username: [isRequired, isValidUsername],
        password: [isRequired, ...isValidPassword]
      }}
      onSubmit={isValid => alert(isValid ? "Success" : "Error")}
      state={this.state}
      render={({ username, password }) => (
        <div>
          <div className="form-group">
            <label>Username (with timeout)</label>
            <input
              className="form-control"
              value={this.state.username}
              onChange={e => {
                this.setState({ username: e.target.value });
                setTimeout(username.validate, 2000);
              }}
              onBlur={username.validate}
            />
            <small className="form-text text-danger">
              {username.validationMessages[0]}
            </small>
          </div>
          <div className="form-group">
            <label>Username (with masking)</label>
            <input
              className="form-control"
              value={this.state.usernameMasking}
              onChange={e => {
                const nextUsername = e.target.value;
                this.setState(currState => ({
                  usernameMasking: isValidUsernameTest(nextUsername)
                    ? nextUsername
                    : currState.usernameMasking
                }));
              }}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            {password.watch(
              <input
                className="form-control"
                value={this.state.password}
                onChange={e => this.setState({ password: e.target.value })}
              />
            )}
            <small className="form-text text-danger">
              {password.validationMessages.map(message => (
                <div key={message}>{message}</div>
              ))}
            </small>
          </div>
          <button type="submit" className="btn btn-dark btn-block">
            Submit
          </button>
        </div>
      )}
    />
  );
}

export default SimpleForm;
