import React, { Component } from "react";
import {
  isEqual,
  mapValues,
  forEach,
  includes,
  every,
  isFunction
} from "lodash";

// DONE:
// Enable submit when form completed
// Dependent fields
// External state
// External/server-side validation
// Validate all fields
// Validate one field at a time
// Custom validation triggers
// Use without needing to wrap your field components

// TODO:
// - Maybe validate right away but don't show error unless it's been successful at some point?
// - Async validation
// - Multiple validations
// - Optional fields (vs required)
// - FIX: Make `allValid` true if `initialValues` is set and they all validate
// - FIX: Make `allValid` if user types into last field and gets it right (before blur)

// MAYBE:
// - Maybe allow for it to work with any validators, not just ones that return strings
// - Add validate() trigger directly
// - Allow using a mix of internal and external state

// TO TEST:
// - Try it on password creation field
// - Use `Validated` for every field except one
// - Use `Validated` except trigger validation on custom logic
// - Dynamically adding fields
// - Delayed validation
// - See if it's worth using this component for showing hints and not errors

// return new function that takes an argument and passes it down to all functions
const compose = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

export default class Validated extends Component {
  constructor(props) {
    super(props);
    const empty = this._mapKeys(() => "");
    this.state = {
      ...empty,
      ...this.props.initialValues,
      validationMessages: this._mapKeys(() => null)
    };
  }
  componentDidMount() {
    this.props.initialValues && this.validateAll();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.state) {
      const validationMessages = mapValues(nextProps.state, () => null);
      this.setState({ validationMessages });
    }
  }
  _getValidations = state =>
    isFunction(this.props.validations)
      ? this.props.validations(state)
      : this.props.validations;
  _mapKeys = cb => mapValues(this._getValidations(), (_, key) => cb(key));
  _getKeyValues = () => (this.props.state ? this.props.state : this.state);
  _getKeyValue = key => this._getKeyValues()[key];
  _getValidationMessage = (key, currState) =>
    this._getValidations(this._getKeyValues)[key](this._getKeyValue(key));
  validateAll = done => {
    this.setState(
      currState => ({
        validationMessages: this._mapKeys(key => {
          // Consider replacing this._getValidations(currState) with this._getKeyValues()
          // TODO: tell user that validations object/function is missing key: [key]
          if (!this._getValidations()[key]) {
            throw new ReferenceError(
              `You're missing key: "${key}" in your validations prop in <Validated />`
            );
          }
          return this._getValidationMessage(key, currState);
        })
      }),
      () => done && done(this.allValid(this.state.validationMessages))
    );
  };
  clear = key => {
    this.setState(currState => ({
      validationMessages: {
        ...currState.validationMessages,
        [key]: null
      }
    }));
  };
  validate = key => {
    this.setState(currState => ({
      validationMessages: {
        ...currState.validationMessages,
        [key]: this._getValidationMessage(key, currState)
      }
    }));
  };
  allComplete = () =>
    !includes(this._mapKeys(key => this._getKeyValue(key)), "");
  allValid = () =>
    every(this.state.validationMessages, message => message === "");
  validateIfValidatedInternal = key => {
    if (this.state.validationMessages[key] !== null) {
      this.validate(key);
    }
  };
  validateIfValidated = key => e => {
    // Assume: `key in this.props.state`
    if (this.props.state) {
      window.setTimeout(() => this.validateIfValidatedInternal(key), 0);
    } else {
      this.setState({ [key]: e.target.value }, () => {
        this.validateIfValidatedInternal(key);
      });
    }
  };
  validateIfNonEmpty = key => () => {
    if (this._getKeyValue(key)) {
      this.validate(key);
    } else {
      this.clear(key);
    }
  };
  setValidationMessages = validationMessages =>
    this.setState({ validationMessages });
  getProps = key => ({ onChange, onBlur, ...rest } = {}) => ({
    name: key,
    value: this._getKeyValue(key), // You can extract state, but you can't set it
    onChange: compose(this.validateIfValidated(key), onChange),
    onBlur: compose(this.validateIfNonEmpty(key), onBlur),
    ...rest
  });
  render() {
    const inputProps = this._mapKeys(key => ({
      name: key,
      value: this._getKeyValue(key),
      validate: () => this.validate(key),
      validateIfValidated: this.validateIfValidated(key),
      validateIfNonEmpty: this.validateIfNonEmpty(key),
      validationMessage: this.state.validationMessages[key] || "",
      getProps: this.getProps(key),
      watch: element => <element.type {...this.getProps(key)(element.props)} />
    }));
    const inputPropsExtended = {
      ...inputProps,
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
