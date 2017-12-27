import { isFunction, mapValues, castArray, flatten, values } from "lodash";

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

export const validateAllWithPromises = (validations, formFields) => {
  // Flatten the validations object so we can run `Promise.all`.
  // Once they all resolve then we map the array back to the original
  // shape so the consumer can parse it.
  const supposedlyValidated = validateAll(validations, formFields);
  const flattened = flatten(values(supposedlyValidated));
  const flattenedWithSafety = flattened.map(maybePromise => {
    if (maybePromise instanceof Promise) {
      return maybePromise.catch(error => {
        if (error instanceof Error) {
          throw error;
        }
        return error;
      });
    }
    return maybePromise;
  });
  return Promise.all(flattenedWithSafety).then(flattenedResults => {
    let i = 0;
    return mapValues(supposedlyValidated, resultArray =>
      resultArray.map(() => {
        return flattenedResults[i++];
      })
    );
  });
};

export const validate = (validations, formFields, key) => {
  const messages = validateAll(validations, formFields);
  const fieldMessages = messages[key];
  return fieldMessages;
};
