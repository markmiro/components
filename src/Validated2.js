import { isFunction, mapValues, castArray } from "lodash";

export const normalizeValidations = validations =>
  isFunction(validations) ? validations : () => validations;

export const mapValidations = (validations, cb) =>
  mapValues(normalizeValidations(validations), (_, key) => cb(key));

export const validateAll = (validations, formFields) => {
  const validationsMap = normalizeValidations(validations)(formFields);
  return mapValues(validationsMap, (validation, fieldKey) => {
    const validationArray = castArray(validation);
    const toValidate = formFields[fieldKey];
    const messages = validationArray.map(validation => validation(toValidate));
    return messages;
  });
};

export const validate = (validations, formFields, key) => {
  const messages = validateAll(validations, formFields);
  const fieldMessages = messages[key];
  return fieldMessages;
};
