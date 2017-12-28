import {
  isFunction,
  mapValues,
  castArray,
  flatten,
  toPairs,
  fromPairs,
  isEmpty,
  isObject,
  filter,
  isNil
} from "lodash";
import pLocate from "p-locate";
import { trace } from "./globals";

/*
TODO: consider allowing consumer to optionally define this.
The rationale is that a validtion may return a non-string. However, we
depend on comparisons to
*/

const isNotEmpty = message =>
  isObject(message) ? !isEmpty(filter(message, isNotEmpty)) : !!message;

const PREFERRED_NIL = "";

const normalizeNil = value => (isNil(value) ? PREFERRED_NIL : value);

export const normalizeValidations = validations =>
  isFunction(validations) ? validations : () => validations;

export const mapValidations = (validations, cb) =>
  mapValues(normalizeValidations(validations), (_, key) => cb(key));

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
    .filter(isNotEmpty);
  return normalizeNil(messages[0]);
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
  Return the first non-empty `resolve` from `promises` or an empty value
  */
  return pLocate(maybePendingValidations, isNotEmpty).then(normalizeNil);
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
  ).then(flattenedResults =>
    fromPairs(
      supposedlyValidatedPairs.map(([k, _], i) => [k, flattenedResults[i]])
    )
  );
};
