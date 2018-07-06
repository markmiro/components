import {
  isFunction,
  mapValues,
  castArray,
  toPairs,
  isEmpty,
  isObject,
  filter,
  every,
  isNil,
  zipObject,
  unzip,
  isEqual
} from "lodash";
import pLocate from "p-locate";
import { trace } from "../globals";

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
  mapValues(normalizeValidations(validations)(), (value, key) =>
    cb(key, value)
  );

export const areAllValid = messages =>
  every(messages, message => message === PREFERRED_NIL);

export const validateAllWith = (validations, fields, fieldValidator) => {
  const normalizedValidations = normalizeValidations(validations)(fields);
  if (!isEqual(Object.keys(normalizedValidations), Object.keys(fields))) {
    throw new Error("The shape of the validations and fields should match.");
  }
  return mapValues(normalizedValidations, (_, key) =>
    fieldValidator(normalizedValidations[key], fields[key])
  );
};

export const validate = (maybeValidationArray, toValidate) =>
  normalizeNil(
    castArray(maybeValidationArray)
      .map(validation => validation(toValidate))
      .find(isNotEmpty)
  );

export const validateAll = (validations, fields) =>
  validateAllWith(validations, fields, validate);

/*
Return the first non-empty `resolve` from `promises` or an empty value
*/
export const validateWithPromises = (maybeValidationArray, toValidate) =>
  pLocate(
    castArray(maybeValidationArray).map(validation => validation(toValidate)),
    isNotEmpty
  ).then(normalizeNil);

export const validateAllWithPromises = (validations, fields) => {
  const validationPromises = validateAllWith(
    validations,
    fields,
    validateWithPromises
  );

  const [keys, values] = unzip(toPairs(validationPromises));
  /*
  NOTE: `Promise.all` doesn't exactly do what we want if the consumer
  of decides to have invalid inputs `reject`. We have no good way of
  differentiating between exceptions thrown because of broken code and
  user errors. The only way we could make it work is if we tested against
  the error object being an instance of `Error`. This may be a good way to go,
  but we'd need to see it actually come up in a few projects before adding such logic.
  */
  return Promise.all(values).then(messages => zipObject(keys, messages));
};
