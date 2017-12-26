import validations from "./validations2";
import { pick } from "lodash";
import { normalizeValidations, validate, validateAll } from "./Validated2";

test("normalizeValidations()", () => {
  const normalized = normalizeValidations(validations);
  expect(normalized()).toBe(validations);
});

describe("validateAll()", () => {
  test("with invalid field", () => {
    const fields = {
      name: ""
    };
    const errorMessages = validateAll({ name: validations.required }, fields);
    expect(errorMessages).toEqual({
      name: ["Required"]
    });
  });
  test("with valid field", () => {
    const fields = {
      name: "Bla"
    };
    const errorMessages = validateAll({ name: validations.required }, fields);
    expect(errorMessages).toEqual({
      name: [""]
    });
  });
  test("with multiple ", () => {
    const fields = {
      email: "bla@bla.com",
      name: ""
    };
    const errorMessages = validateAll(
      {
        email: validations.email,
        name: validations.name
      },
      fields
    );
    expect(errorMessages).toEqual({
      email: ["", ""],
      name: ["At least 2 characters required"]
    });
  });
});

test("validate()", () => {
  const fields = {
    email: "bla@bla.com",
    name: ""
  };
  const messages = validate(
    {
      email: validations.email,
      name: validations.name
    },
    fields,
    "email"
  );
  expect(messages).toEqual(["", ""]);
});
