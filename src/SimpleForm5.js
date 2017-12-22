import React from "react";
import { ValidatedForm } from "./Validated";
import "bootstrap/dist/css/bootstrap.css";

const validations = {
  name: value => (value.length === 0 ? "Required" : ""),
  email: value => (/\S+@\S+\.\S+/.test(value) ? "" : "Invalid email")
};

const SimpleForm = () => (
  <ValidatedForm
    validations={validations}
    onSubmit={isValid => alert(isValid ? "Success" : "Error")}
    render={({ name, email }) => (
      <div>
        <div className="form-group">
          <label>Name</label>
          <input className="form-control" {...name.getProps()} />
          <small className="form-text text-danger">
            {name.validationMessage}
          </small>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input className="form-control" {...email.getProps()} />
          <small className="form-text text-danger">
            {email.validationMessage}
          </small>
        </div>
        <button type="submit" className="btn btn-dark btn-block">
          Submit
        </button>
      </div>
    )}
  />
);

export default SimpleForm;
