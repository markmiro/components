import validator from "validator";

const emailHasCon = value => /\.con$/.test(value);

const validations = {
    required: value => (validator.isEmpty(value) ? "Required" : ""),
    name: value => (value.length < 2 ? "At least 2 characters required" : ""),
    fName: value => (value.length < 2 ? "At least 2 characters required" : ""),
    email: [
        value => (validator.isEmail(value) ? "" : "Email is invalid"),
        value => (emailHasCon(value) ? "(.con) is not allowed" : "")
    ],
    confirmEmail: (email, confirmEmail) =>
        email === confirmEmail ? "" : "Emails must match",
    password: value => [
        /[A-Z]/.test(value) ? "" : "1 capital letter required (A-Z)",
        /[a-z]/.test(value) ? "" : "1 lowercase letter required (a-z)",
        /[0-9]/.test(value) ? "" : "1 number required (0-9)",
        value.length >= 8 ? "" : "At least 8 characters required"
    ]
};

export default validations;
