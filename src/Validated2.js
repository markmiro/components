import {
  isFunction,
  mapValues,
  castArray,
  flatten,
  toPairs,
  fromPairs
} from "lodash";
import pLocate from "p-locate";
import { trace } from "./globals";

const NO_ERROR = "";

export const normalizeValidations = validations =>
  isFunction(validations) ? validations : () => validations;

// export const mapValidations = (validations, cb) =>
//   mapValues(normalizeValidations(validations), (_, key) => cb(key));

const throwIfInvalid = (normalizedValidations, fields, key) => {
  // Throw right away since it's a programmer error
  if (!(key in fields)) throw new Error(`"${key}" missing in "fields"`);
  if (!(key in normalizedValidations))
    throw new Error(
      `"${key}" missing in "normalizedValidations" object or function return`
    );
};

export const validate = (maybeValidationArray, toValidate) => {
  const messages = castArray(maybeValidationArray)
    .map(validation => validation(toValidate))
    .filter(message => message !== NO_ERROR);
  return messages.length === 0 ? "" : messages[0];
};

export const validateAll = (validations, fields) => {
  const normalizedValidations = normalizeValidations(validations)(fields);
  return mapValues(normalizedValidations, (maybeValidationArray, key) => {
    throwIfInvalid(normalizedValidations, fields, key);
    return validate(normalizedValidations[key], fields[key]);
  });
};

export const validateWithPromises = (maybeValidationArray, toValidate) => {
  const maybePendingValidations = castArray(
    maybeValidationArray
  ).map(validation => validation(toValidate));

  /*
  Return the first non-empty `resolve` from `promises`
  or an empty string if they all resolve to an empty string.
  */
  return pLocate(maybePendingValidations, result => result !== NO_ERROR).then(
    result => (!result ? NO_ERROR : result)
  );
};

export const validateAllWithPromises = (validations, fields) => {
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
  const normalizedValidations = normalizeValidations(validations)(fields);
  const supposedlyValidated = mapValues(
    normalizedValidations,
    (maybeValidationArray, key) => {
      throwIfInvalid(normalizedValidations, fields, key);
      return validateWithPromises(normalizedValidations[key], fields[key]);
    }
  );
  const supposedlyValidatedPairs = toPairs(supposedlyValidated);
  return Promise.all(
    flatten(supposedlyValidatedPairs.map(([k, v]) => v))
  ).then(flattenedResults => {
    let i = 0;
    return fromPairs(
      supposedlyValidatedPairs.map(([k, resultArray]) => [
        k,
        castArray(resultArray).map(() => flattenedResults[i++])
      ])
    );
  });
};
