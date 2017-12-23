import React, { Component } from "react";
import {
  isEqual,
  mapValues,
  forEach,
  includes,
  every,
  isFunction,
  isEmpty,
  castArray,
  first
} from "lodash";

// DONE:
// - Enable submit when form completed
// - Dependent fields
// - External state
// - External/server-side validation
// - Validate all fields
// - Validate one field at a time
// - Custom validation triggers
// - Use without needing to wrap your field components
// - Multiple validations
// - Multiple error messages

// TODO:
// - Async validation

// MAYBE:
// - Validate right away but don't show error unless it's been successful at some point?
// - Allow for it to work with any validators, not just ones that return strings
// - Add validate() trigger directly
// - Allow using a mix of internal and external state
// - Add masks
// - Have feature parity with `redux-form` and `Angular 5` forms
//   - States: pristine, untouched, touched, invalid, valid
// - Make `allValid` if user types into last field and gets it right (before blur)

// TO TEST:
// - Input normalization
// - Dynamically adding fields
// - Delayed validation
// - See if it's worth using this component for showing hints and not errors
// - Multiple-screen form

const EMPTY_VALUE = "";
const NO_ERROR = [];
const NO_VALIDATION = null;

// return new function that takes an argument and passes it down to all functions
const compose = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

export default class Validated extends Component {
  constructor(props) {
    super(props);
    const empty = this._mapKeys(() => EMPTY_VALUE);
    this.state = {
      ...empty,
      ...this.props.initialValues,
      validationMessages: this._mapKeys(() => NO_VALIDATION)
    };
  }
  componentDidMount() {
    this.props.initialValues && this.validateAll();
  }
  _getFields = () => (this.props.state ? this.props.state : this.state);
  _getValidations = state =>
    isFunction(this.props.validations)
      ? this.props.validations(state)
      : this.props.validations;
  _getValidationMessages = (key, toValidate = this._getFields()[key]) => {
    const validators = castArray(this._getValidations(this._getFields())[key]);
    const nonEmpty = message => !isEmpty(message);
    return validators.map(validator => validator(toValidate)).filter(nonEmpty);
  };
  _mapKeys = cb => mapValues(this._getValidations(), (_, key) => cb(key));
  validateAll = done => {
    this.setState(
      {
        validationMessages: this._mapKeys(key => {
          // TODO: tell user that validations object/function is missing key: [key]
          if (!this._getValidations()[key]) {
            throw new ReferenceError(
              `You're missing key: "${key}" in your validations prop in <Validated />`
            );
          }
          return this._getValidationMessages(key);
        })
      },
      () => done && done(this.allValid(this.state.validationMessages))
    );
  };
  allComplete = () =>
    !includes(this._mapKeys(key => this._getFields()[key]), EMPTY_VALUE);
  allValid = () =>
    every(this.state.validationMessages, message => isEqual(message, NO_ERROR));
  setValidationMessages = validationMessages =>
    this.setState({ validationMessages });
  keyFields = key => {
    const value = this._getFields()[key];
    const clear = () => {
      this.setState(currState => ({
        validationMessages: {
          ...currState.validationMessages,
          [key]: NO_VALIDATION
        }
      }));
    };
    const validate = () => {
      window.setTimeout(
        () =>
          this.setState({
            validationMessages: {
              ...this.state.validationMessages,
              [key]: this._getValidationMessages(key)
            }
          }),
        0
      );
    };
    const validateIfValidated = e => {
      const validateIfValidatedInternal = key => {
        if (this.state.validationMessages[key] !== NO_VALIDATION) {
          validate();
        }
      };
      // Assume: `key in this.props.state`
      if (this.props.state) {
        window.setTimeout(() => validateIfValidatedInternal(key), 0);
      } else {
        this.setState({ [key]: e.target.value }, () =>
          validateIfValidatedInternal(key)
        );
      }
    };
    const validateIfNonEmpty = () => {
      if (value) {
        validate();
      } else {
        clear();
      }
    };
    const getProps = ({ onChange, onBlur, ...rest } = {}) => ({
      name: key,
      value, // You can extract state, but you can't set it
      onChange: compose(validateIfValidated, onChange),
      onBlur: compose(validateIfNonEmpty, onBlur),
      ...rest
    });
    return {
      value,
      getValidationMessages: value => this._getValidationMessages(key, value),
      validate,
      validateIfValidated,
      validateIfNonEmpty,
      validationMessage: castArray(this.state.validationMessages[key])[0] || "",
      validationMessages: this.state.validationMessages[key] || NO_ERROR,
      getProps,
      watch: element => <element.type {...getProps(element.props)} />
    };
  };
  render() {
    const inputPropsExtended = {
      ...this._mapKeys(key => ({
        name: key,
        ...this.keyFields(key)
      })),
      // MAYBE: consider putting these in the second render prop arg as helper functions
      // MAYBE: consider making `validationMessages` state live outside this component
      setValidationMessages: this.setValidationMessages,
      validateAll: this.validateAll,
      allComplete: this.allComplete,
      allValid: this.allValid
    };
    return this.props.render(inputPropsExtended);
  }
}

// Minimal API for full customization:
// props.validations
// props.render
//   [key].validate
//   [key].validateIfInvalid
//   [key].validateIfNotEmpty
//   [key].errorMessage
//   setValidationMessages()
//   validateAll()
//   areAllValid()

// Minimal API for basic use
// props.validations
// props.render
//   [key].watch OR [key].getProps
//   validateAll()
//   areAllValid()
//   areAllComplete()

export const ValidatedForm = ({ onSubmit, render, ...props }) => (
  <Validated
    {...props}
    render={({ validateAll, ...args }) => (
      <form
        onSubmit={e => {
          e.preventDefault();
          validateAll(isValid => {
            onSubmit && onSubmit(isValid);
          });
        }}
      >
        {render({ validateAll, ...args })}
      </form>
    )}
  />
);
