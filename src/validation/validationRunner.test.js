import validations from "./validations2";
import validator from "validator";
import {
  mapValidations,
  normalizeValidations,
  validate,
  validateAll,
  validateAllWithPromises,
  validateWithPromises
} from "./validationRunner";

// TODO: test dependent fields

// Using this so empty message can be changed and tests are easier to update
const NO_MESSAGE = "";

test("normalizeValidations()", () => {
  const normalized = normalizeValidations(validations);
  expect(normalized()).toBe(validations);
});

test("mapValidations()", () => {
  const validations = {
    name: () => "",
    email: () => ""
  };
  const mapped = mapValidations(validations, () => "testValue");
  expect(mapped).toEqual({
    name: "testValue",
    email: "testValue"
  });
});

describe("validate()", () => {
  test("with invalid value", () => {
    const errorMessages = validate(validations.required, "");
    expect(errorMessages).toEqual("Required");
  });
  test("with function returned as validation message", () => {
    const errorFunc = () => {};
    const randomValidation = value => errorFunc;
    const errorMessages = validate(randomValidation, "");
    expect(errorMessages).toEqual(errorFunc);
  });
  test("with valid value", () => {
    const errorMessages = validate(validations.required, "Bla");
    expect(errorMessages).toEqual(NO_MESSAGE);
  });
  test("with multiple error messages via function that returns an array", () => {
    const isValidPassword = value => [
      /[0-9]/.test(value) ? "" : "Please include a number",
      /[A-Z]/.test(value) ? "" : "Please include a captital letter"
    ];
    expect(validate(isValidPassword, "bla")).toEqual([
      "Please include a number",
      "Please include a captital letter"
    ]);
    expect(validate(isValidPassword, "1la")).toEqual([
      "",
      "Please include a captital letter"
    ]);
  });
  test("with multiple error messages via array of validators", () => {
    const isValidPassword = [
      value => (/[0-9]/.test(value) ? "" : "Please include a number"),
      value => (/[A-Z]/.test(value) ? "" : "Please include a captital letter")
    ];
    const errorMessages = validate(isValidPassword, "bla1");
    expect(errorMessages).toEqual("Please include a captital letter");
  });
});

describe("validateAll()", () => {
  test("with invalid field", () => {
    const fields = {
      name: ""
    };
    const errorMessages = validateAll({ name: validations.required }, fields);
    expect(errorMessages).toEqual({
      name: "Required"
    });
  });
  test("with valid field", () => {
    const fields = {
      name: "Bla"
    };
    const errorMessages = validateAll({ name: validations.required }, fields);
    expect(errorMessages).toEqual({
      name: NO_MESSAGE
    });
  });
  test("with multiple", () => {
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
      email: NO_MESSAGE,
      name: "At least 2 characters required"
    });
  });
  test("with multiple error messages", () => {
    const isValidPassword = value => [
      /[0-9]/.test(value) ? "" : "Please include a number",
      /[A-Z]/.test(value) ? "" : "Please include a captital letter"
    ];
    const errorMessages = validateAll(
      {
        email: validations.email,
        password: isValidPassword
      },
      {
        email: "bla",
        password: "bla"
      }
    );
    expect(errorMessages).toEqual({
      email: "Email is invalid",
      password: ["Please include a number", "Please include a captital letter"]
    });
  });
});

describe("validateWithPromises()", () => {
  test("with multiple error messages", () => {
    const isValidPassword = value => [
      /[0-9]/.test(value) ? "" : "Please include a number",
      /[A-Z]/.test(value) ? "" : "Please include a captital letter"
    ];
    return validateWithPromises(isValidPassword, "bla").then(message =>
      expect(message).toEqual([
        "Please include a number",
        "Please include a captital letter"
      ])
    );
  });
  test("with multiple error messages", () => {
    const isValidPassword = [
      value => [
        /[0-9]/.test(value) ? "" : "Please include a number",
        /[A-Z]/.test(value) ? "" : "Please include a captital letter"
      ],
      value =>
        new Promise(resolve =>
          resolve(
            value === "Password1"
              ? "You can't use the password 'Password1'"
              : ""
          )
        )
    ];
    return validateWithPromises(isValidPassword, "Password1").then(message =>
      expect(message).toEqual("You can't use the password 'Password1'")
    );
  });
  test("with multiple error messages", () => {
    const isValidPassword = [
      value => ({
        one: [/[0-9]/.test(value) ? "" : "Please include a number"],
        two: /[A-Z]/.test(value) ? "" : "Please include a captital letter"
      }),
      value =>
        new Promise(resolve =>
          resolve(
            // Doesn't evaluate this since first error is returned
            value === "Password" ? "You can't use the password 'Password1'" : ""
          )
        )
    ];
    return validateWithPromises(isValidPassword, "Password").then(message =>
      expect(message).toEqual({
        one: ["Please include a number"],
        two: ""
      })
    );
  });
  test("with multiple error messages", () => {
    const isValidPassword = [
      value => ({
        one: [/[0-9]/.test(value) ? "" : "Please include a number"],
        two: /[A-Z]/.test(value) ? "" : "Please include a captital letter"
      }),
      value =>
        new Promise(resolve =>
          resolve(
            // Doesn't evaluate this since first error is returned
            value === "Password" ? "You can't use the password 'Password1'" : ""
          )
        )
    ];
    return validateWithPromises(isValidPassword, "Password1").then(message =>
      expect(message).toEqual(NO_MESSAGE)
    );
  });
  test("with multiple error messages", () => {
    const isValidPassword = [
      value => (/[0-9]/.test(value) ? "" : "Please include a number"),
      value => (/[A-Z]/.test(value) ? "" : "Please include a captital letter")
    ];
    return validateWithPromises(isValidPassword, "bla").then(message =>
      expect(message).toEqual("Please include a number")
    );
  });
  test("with multiple error messages success", () => {
    const isValidPassword = value => [
      /[0-9]/.test(value) ? "" : "Please include a number",
      /[A-Z]/.test(value) ? "" : "Please include a captital letter"
    ];
    return validateWithPromises(isValidPassword, "blaA1").then(message =>
      expect(message).toEqual(NO_MESSAGE)
    );
  });
  test("non-promise with valid input", () => {
    return validateWithPromises(validations.required, "bla").then(message => {
      expect(message).toEqual(NO_MESSAGE);
    });
  });
  test("non-promise with invalid input", () => {
    return validateWithPromises(validations.required, "").then(message => {
      expect(message).toEqual("Required");
    });
  });
  test("promise with valid input", () => {
    const requiredAsync = value => Promise.resolve(validations.required(value));
    return validateWithPromises(requiredAsync, "bla").then(message => {
      expect(message).toEqual(NO_MESSAGE);
    });
  });
  test("promise with invalid input", () => {
    const requiredAsync = value => Promise.resolve(validations.required(value));
    return validateWithPromises(requiredAsync, "").then(message => {
      expect(message).toEqual("Required");
    });
  });
  test("promise array with valid input", () => {
    return validateWithPromises(
      [
        value => Promise.resolve(validations.required(value)),
        value => Promise.resolve(validations.name(value))
      ],
      "bla"
    ).then(message => {
      expect(message).toEqual(NO_MESSAGE);
    });
  });
  test("promise array with invalid input", () => {
    return validateWithPromises(
      [
        value => Promise.resolve(validations.required(value)),
        value => Promise.resolve(validations.name(value))
      ],
      "b"
    ).then(message => {
      expect(message).toEqual("At least 2 characters required");
    });
  });
  test("handle missing validations", () => {
    try {
      validateWithPromises([], formFields, "");
    } catch (error) {
      expect(error instanceof Error).toBe(true);
    }
  });
  test("handle wrong validations", () => {
    try {
      validateWithPromises("", "");
    } catch (error) {
      expect(error instanceof Error).toBe(true);
    }
  });
});

describe("validateAllWithPromises()", () => {
  /*
  The function should work without promises because then the same
  function can take a mixture of promises and non-promises
  */
  test("without promises", () => {
    const messagesPromise = validateAllWithPromises(
      {
        username: validations.required,
        email: validations.required
      },
      {
        username: "bla",
        email: "bla@example.com"
      }
    );
    return messagesPromise.then(result =>
      expect(result).toEqual({
        username: NO_MESSAGE,
        email: NO_MESSAGE
      })
    );
  });

  test("with promises", () => {
    const formValidations = {
      username: value => Promise.resolve(validations.required(value)),
      email: value => Promise.resolve(validations.required(value))
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
      expect(result).toEqual({ username: NO_MESSAGE, email: NO_MESSAGE });
    });
  });

  /*
  It may make sense to reject rather then resolving. However,
  validations logic is arguable error logic. Therefore, resolved means
  that the validation code executed successfully. It doesn't mean that the
  user input is valid.
  */
  test("with promises that resolve error messages", () => {
    const formValidations = {
      username: value => Promise.resolve(validations.required(value)),
      email: value => Promise.resolve(validations.required(value))
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
      expect(result).toEqual({ username: "Required", email: "Required" });
    });
  });
  test("handle missing validations", () => {
    const formValidations = {};
    const formFields = {
      username: ""
    };
    try {
      return validateAllWithPromises(formValidations, formFields).then(
        ({ username }) => expect(username).toBe(undefined)
      );
    } catch (error) {
      expect(error instanceof Error).toBe(true);
    }
  });
  test("handle missing form fields by throwing error", () => {
    const formValidations = {
      username: value => Promise.resolve(validations.required(value))
    };
    const formFields = {};
    try {
      return validateAllWithPromises(formValidations, formFields);
    } catch (error) {
      expect(error instanceof Error).toBe(true);
    }
  });

  /*
  Ideally, the user wouldn't be using validators that reject on invalid input
  since programmer errors also reject, and there's no go way to distinguish
  the two. Rejecting without an Error object seems promising though.
  */
  test("work ok with promises that reject for invalid input", () => {
    const emailValidator = value =>
      validator.isEmail(value)
        ? Promise.resolve()
        : Promise.reject("Email is invalid");
    const formValidations = {
      email1: emailValidator,
      email2: emailValidator
    };
    const formFields = {
      email1: "bla@",
      email2: "bla@bla.com"
    };
    const messagesPromise = validateAllWithPromises(
      formValidations,
      formFields
    );
    return messagesPromise.catch(result => {
      /*
      Of course we wanna make sure that validation still kinda works.
      There's no way to determine which field this message belongs to
      unless it's in the error message itself.
      */
      expect(result).toEqual("Email is invalid");
    });
  });

  test("propagate error objects when promises reject", () => {
    const formValidations = {
      username: value => Promise.reject(new Error("Something")),
      email: value => Promise.reject(validations.required(value))
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
        expect(true).toBe(false);
      })
      .catch(error => {
        // Only expecting to see the first error
        expect(error instanceof Error).toBe(true);
        expect(error.message).toEqual("Something");
      });
  });
  test("propagate exceptions in promises", () => {
    const formValidations = {
      username: value => {
        return new Promise(() => {
          value.bla.bla;
        });
      }
    };
    const formFields = {
      username: ""
    };
    return validateAllWithPromises(formValidations, formFields).catch(error => {
      expect(error instanceof TypeError).toBe(true);
    });
  });
});
