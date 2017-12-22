import React from "react";
import { ValidatedForm } from "./Validated";
import "bootstrap/dist/css/bootstrap.css";

const isRequired = value => (value === "" ? "Required" : "");
const isValidUsername = value =>
  value.indexOf(" ") > -1 ? "No spaces allowed" : "";
const isValidEmail = value =>
  /\S+@\S+\.\S+/.test(value) ? "" : "Invalid email";

class SimpleForm extends React.Component {
  state = {
    username: "",
    email: ""
  };
  render = () => (
    <ValidatedForm
      validations={{
        username: [isRequired, isValidUsername],
        email: [isRequired, isValidEmail]
      }}
      onSubmit={isValid => alert(isValid ? "Success" : "Error")}
      state={this.state}
      render={({ username, email, allComplete }) => (
        <div>
          <div className="form-group">
            <label>Username</label>
            {username.watch(
              <input
                className="form-control"
                value={this.state.username}
                onChange={e => this.setState({ username: e.target.value })}
              />
            )}
            <small className="form-text text-danger">
              {username.validationMessage}
            </small>
          </div>
          <div className="form-group">
            <label>Email</label>
            {email.watch(
              <input
                className="form-control"
                value={this.state.email}
                onChange={e => this.setState({ email: e.target.value })}
              />
            )}
            <small className="form-text text-danger">
              {email.validationMessage}
            </small>
          </div>
          <button
            // disabled={!allComplete()}
            type="submit"
            className="btn btn-dark btn-block"
          >
            Submit
          </button>
          <button
            disabled={!allComplete()}
            type="button"
            className="btn btn-outline-dark btn-block"
            onClick={() => this.setState({ username: "", email: "" })}
          >
            Clear
          </button>
        </div>
      )}
    />
  );
}

export default SimpleForm;
