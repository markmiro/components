import {
  isFunction,
  mapValues,
  castArray,
  flatten,
  values,
  toPairs,
  fromPairs,
  partition
} from "lodash";
import { trace } from "./globals";

const NO_ERROR = "";

export const normalizeValidations = validations =>
  isFunction(validations) ? validations : () => validations;

// export const mapValidations = (validations, cb) =>
//   mapValues(normalizeValidations(validations), (_, key) => cb(key));

export const validateAll = (validations, formFields) =>
  mapValues(
    normalizeValidations(validations)(formFields),
    (validation, fieldKey) =>
      castArray(validation).map(validation => {
        if (fieldKey in formFields) return validation(formFields[fieldKey]);
        throw new Error(`"${fieldKey}" missing in "formFields"`);
      })
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

const resolveFirstPromiseThatReturnsNonEmptyString = arrayOfMaybePromises => {
  // Normalize everything into a promise
  const promises = arrayOfMaybePromises.map(
    maybePromise =>
      maybePromise instanceof Promise
        ? maybePromise
        : Promise.resolve(maybePromise)
  );
  /*
  Return the first non-empty `resolve` from `promises`
  or an empty string if they all resolve to an empty string.
  */
  let resolved = 0;
  return new Promise((resolve, reject) => {
    promises.map(promise =>
      promise.then(result => {
        resolved++;
        if (result !== NO_ERROR) {
          resolve(result);
        } else if (resolved === promises.length) {
          resolve(NO_ERROR);
        }
      })
    );
  });
};

/*
TODO: always return the first error and no others for each validation
Need to make it work for multiple
*/
export const validateWithPromise = (validations, formFields, key) => {
  const validationsForKey = normalizeValidations(validations)(formFields)[key];
  const maybePendingValidations = castArray(
    validationsForKey
  ).map(validation => {
    if (key in formFields) return validation(formFields[key]);
    throw new Error(`"${key}" missing in "formFields"`);
  });
  return resolveFirstPromiseThatReturnsNonEmptyString(maybePendingValidations);
};
