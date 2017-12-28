import validations from "./validations2";
import validator from "validator";
import { pick } from "lodash";
import {
  normalizeValidations,
  validate,
  validateAll,
  validateAllWithPromises,
  validateWithPromise,
  validateWith
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
    return messagesPromise.then(({ username, email }) => {
      expect(username).toEqual([""]);
      expect(email).toEqual([""]);
    });
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
      expect(result).toEqual({ username: [""], email: [""] });
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
      expect(result).toEqual({ username: ["Required"], email: ["Required"] });
    });
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

  test("propogate error objects when promises reject", () => {
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
  test("propogate exceptions in promises", () => {
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
  test("handle missing validations", () => {
    const formValidations = {};
    const formFields = {
      username: ""
    };
    return validateAllWithPromises(
      formValidations,
      formFields
    ).then(({ username }) => expect(username).toBe(undefined));
  });
  test("handle missing form fields by throwing error", () => {
    const formValidations = {
      username: value => Promise.resolve(validations.required(value))
    };
    const formFields = {};
    try {
      validateAllWithPromises(formValidations, formFields);
    } catch (error) {
      expect(error instanceof Error).toBe(true);
    }
  });
});

describe("validateWithPromise()", () => {
  test("non-promise with valid input", () => {
    return validateWithPromise(
      { username: validations.required },
      { username: "bla" },
      "username"
    ).then(message => {
      expect(message).toEqual("");
    });
  });
  test("non-promise with invalid input", () => {
    return validateWithPromise(
      { username: validations.required },
      { username: "" },
      "username"
    ).then(message => {
      expect(message).toEqual("Required");
    });
  });
  test("promise with valid input", () => {
    return validateWithPromise(
      { username: value => Promise.resolve(validations.required(value)) },
      { username: "bla" },
      "username"
    ).then(message => {
      expect(message).toEqual("");
    });
  });
  test("promise with invalid input", () => {
    return validateWithPromise(
      { username: value => Promise.resolve(validations.required(value)) },
      { username: "" },
      "username"
    ).then(message => {
      expect(message).toEqual("Required");
    });
  });
  test("promise array with valid input", () => {
    return validateWithPromise(
      {
        username: [
          value => Promise.resolve(validations.required(value)),
          value => Promise.resolve(validations.name(value))
        ]
      },
      { username: "bla" },
      "username"
    ).then(message => {
      expect(message).toEqual("");
    });
  });
  test("promise array with invalid input", () => {
    return validateWithPromise(
      {
        username: [
          value => Promise.resolve(validations.required(value)),
          value => Promise.resolve(validations.name(value))
        ]
      },
      { username: "b" },
      "username"
    ).then(message => {
      expect(message).toEqual("At least 2 characters required");
    });
  });
  test("handle missing validations", () => {
    const formValidations = {};
    const formFields = {
      username: ""
    };
    try {
      return validateWithPromise(formValidations, formFields, "username");
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
      return validateWithPromise(formValidations, formFields, "username");
    } catch (error) {
      expect(error instanceof Error).toBe(true);
    }
  });
});

describe("validateWith()", () => {
  test("non-promise with valid input", () => {
    return validateWith(validations.required, "bla").then(message => {
      expect(message).toEqual("");
    });
  });
  test("non-promise with invalid input", () => {
    return validateWith(validations.required, "").then(message => {
      expect(message).toEqual("Required");
    });
  });
  test("promise with valid input", () => {
    const requiredAsync = value => Promise.resolve(validations.required(value));
    return validateWith(requiredAsync, "bla").then(message => {
      expect(message).toEqual("");
    });
  });
  test("promise with invalid input", () => {
    const requiredAsync = value => Promise.resolve(validations.required(value));
    return validateWith(requiredAsync, "").then(message => {
      expect(message).toEqual("Required");
    });
  });
  test("promise array with valid input", () => {
    return validateWith(
      [
        value => Promise.resolve(validations.required(value)),
        value => Promise.resolve(validations.name(value))
      ],
      "bla"
    ).then(message => {
      expect(message).toEqual("");
    });
  });
  test("promise array with invalid input", () => {
    return validateWith(
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
      validateWith([], formFields, "");
    } catch (error) {
      expect(error instanceof Error).toBe(true);
    }
  });
  test("handle wrong validations", () => {
    try {
      validateWith("", "");
    } catch (error) {
      expect(error instanceof Error).toBe(true);
    }
  });
});
