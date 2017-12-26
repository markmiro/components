import validator from "validator";

const emailHasCon = value => value.indexOf(".con") > -1;

const validations = {
  required: value => (validator.isEmpty(value) ? "Required" : ""),
  name: value => (value.length < 2 ? "At least 2 characters required" : ""),
  fName: value => (value.length < 2 ? "At least 2 characters required" : ""),
  email: [
    value => (validator.isEmail(value) ? "" : "Email is invalid"),
    value => (emailHasCon(value) ? "(.con) is not allowed" : "")
  ],
  confirmEmail: (email, confirmEmail) =>
    email === confirmEmail ? "" : "Emails must match"
};

export default validations;
