const validators = {
  empty: value => /^\s*$/.test(value),
  email: value => /\S+@\S+\.\S+/.test(value),
  emailHasCon: value => value.indexOf(".con") > -1
};

const validations = {
  name: value =>
    (validators.empty(value) && "Required") ||
    (value.length < 2 && "At least 2 characters required") ||
    "",
  fName: value =>
    (validators.empty(value) && "Required") ||
    (value.length < 2 && "At least 2 characters required") ||
    "",
  email: value =>
    (validators.empty(value) && "Required") ||
    (!validators.email(value) && "Email is invalid") ||
    (validators.emailHasCon(value) && "(.con) is not allowed") ||
    "",
  confirmEmail: (email, confirmEmail) =>
    (validators.empty(email) && "Required") || email === confirmEmail
      ? ""
      : "Emails must match"
};

export default validations;
