import {
  isFunction,
  mapValues,
  castArray,
  flatten,
  values,
  toPairs,
  fromPairs
} from "lodash";
import { trace } from "./globals";

export const normalizeValidations = validations =>
  isFunction(validations) ? validations : () => validations;

// export const mapValidations = (validations, cb) =>
//   mapValues(normalizeValidations(validations), (_, key) => cb(key));

export const validateAll = (validations, formFields) =>
  mapValues(
    normalizeValidations(validations)(formFields),
    (validation, fieldKey) =>
      castArray(validation).map(validation => validation(formFields[fieldKey]))
  );

export const validateAllWithPromises = (validations, formFields) => {
  /*
  Flatten the validations object so we can run `Promise.all`.
  Once they all resolve then we map the array back to the original
  shape so the consumer can parse it.

  Also, `Promise.all` doesn't exactly do what we want if the consumer
  of decides to have invalid inputs `reject`. We have no good way of
  differentiating between exceptions thrown because of broken code and
  user errors. The only way we could make it work is if we tested against
  the error object being an instance of `Error`. This may be a good way to go,
  but we'd need to see it actually come up in a few projects before adding such logic.
  */
  const supposedlyValidated = toPairs(validateAll(validations, formFields));
  return Promise.all(
    flatten(supposedlyValidated.map(([k, v]) => v))
  ).then(flattenedResults => {
    let i = 0;
    return fromPairs(
      supposedlyValidated.map(([k, resultArray]) => [
        k,
        resultArray.map(() => flattenedResults[i++])
      ])
    );
  });
};

export const validate = (validations, formFields, key) =>
  validateAll(validations, formFields)[key];
