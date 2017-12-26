import { normalizeValidations, validate, validateAll } from "./Validated2";

const validations = {
  email: value => (value.includes("@") ? "" : "Invalid email"),
  name: value => (!!value ? "" : "Required")
};

test("normalizeValidations()", () => {
  const normalized = normalizeValidations(validations);
  expect(normalized()).toBe(validations);
});

test("validateAll()", () => {
  const fields = {
    email: "bla@bla.com",
    name: ""
  };
  const errorMessages = validateAll(validations, fields);
  expect(errorMessages).toEqual({
    email: [""],
    name: ["Required"]
  });
});

test("validate()", () => {
  const fields = {
    email: "bla@bla.com",
    name: ""
  };
  const messages = validate(validations, fields, "email");
  expect(messages).toEqual([""]);
});
