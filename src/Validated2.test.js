import validations from "./validations2";
import { pick } from "lodash";
import {
  normalizeValidations,
  validate,
  validateAll,
  validateAllWithPromises
} from "./Validated2";

// TODO: add tests to make sure exceptions are handled properly

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

describe("validateAllWithPromises()", () => {
  test("without promises", () => {
    const messagesPromise = validateAllWithPromises(
      {
        username: [validations.required],
        email: [validations.required]
      },
      {
        username: "bla",
        email: "bla@example.com"
      }
    );
    return messagesPromise.then(({ username, email }) => {
      expect(username).toEqual([""]);
      expect(email).toEqual([""]);
    });
  });
  test("with promises", () => {
    const formValidations = {
      username: [value => Promise.resolve(validations.required(value))],
      email: [value => Promise.resolve(validations.required(value))]
    };
    const formFields = {
      username: "bla",
      email: "bla@example.com"
    };
    const messagesPromise = validateAllWithPromises(
      formValidations,
      formFields
    );
    return messagesPromise.then(result => {
      expect(result).toEqual({ username: [""], email: [""] });
    });
  });
  test("with promises that resolve error messages", () => {
    const formValidations = {
      username: [value => Promise.resolve(validations.required(value))],
      email: [value => Promise.resolve(validations.required(value))]
    };
    const formFields = {
      username: "",
      email: ""
    };
    const messagesPromise = validateAllWithPromises(
      formValidations,
      formFields
    );
    return messagesPromise.then(result => {
      expect(result).toEqual({ username: ["Required"], email: ["Required"] });
    });
  });
  test("with promises that reject", () => {
    const formValidations = {
      username: [value => Promise.reject(validations.required(value))],
      email: [value => Promise.reject(validations.required(value))]
    };
    const formFields = {
      username: "",
      email: ""
    };
    const messagesPromise = validateAllWithPromises(
      formValidations,
      formFields
    );
    return messagesPromise
      .then(result => {
        expect(result).toEqual({ username: ["Required"], email: ["Required"] });
      })
      .catch(errors => {
        expect(errors).toEqual("");
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
