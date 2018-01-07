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
  first,
  omit,
  findKey
} from "lodash";
import {
  normalizeValidations,
  mapValidations,
  validateWithPromises,
  validateAllWithPromises
} from "./Validated2";
import { trace } from "./globals";

const EMPTY_VALUE = "";
const NO_ERROR = "";
const NO_VALIDATION = null;

// return new function that takes an argument and passes it down to all functions
const compose = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

/*
TODO:
Use `shouldComponentUpdate` to prevent wasted renders
*/

/*
Rendering
---
This component does 3-staged rendering:
  1) Set field value
  2) Validate
  3) Update `_shouldShake` to be false
*/
export default class Validated extends Component {
  constructor(props) {
    super(props);
    this._refs = {};
    const empty = mapValidations(props.validations, () => EMPTY_VALUE);
    this.state = {
      ...empty,
      // Since state keys are defined by consumer, we need a name that can't conflict
      _messages: mapValidations(props.validations, () => NO_VALIDATION),
      _shouldShake: mapValidations(props.validations, () => ""),
      _keyFocused: null
    };
  }
  fields = () => omit(this.state, ["_messages", "_shouldShake", "_keyFocused"]);
  _validateAll = cb => {
    this.setState({ _keyFocused: null });
    const onChange = (key, message) => {
      this.setState(
        state => {
          const shouldFocus = !state._keyFocused && message;
          if (shouldFocus && this._refs[key]) {
            this._refs[key].focus();
          }
          return {
            _messages: {
              ...state._messages,
              [key]: message
            },
            _shouldShake: {
              ...state._shouldShake,
              [key]: shouldFocus
            },
            _keyFocused: shouldFocus ? key : state._keyFocused
          };
        },
        () =>
          window.setTimeout(
            () =>
              this.setState(state => ({
                _shouldShake: {
                  ...state._shouldShake,
                  [key]: false
                }
              })),
            500
          )
      );
    };
    validateAllWithPromises(
      this.props.validations,
      this.fields(),
      onChange
    ).then(_messages => cb(this.fields(), _messages, true));
  };
  _helpersForKey = key => {
    const setMessage = message =>
      this.setState(
        state => ({
          _messages: {
            ...state._messages,
            [key]: message
          },
          _shouldShake: {
            ...state._shouldShake,
            [key]: !!message && !state._messages[key]
          }
        }),
        () =>
          window.setTimeout(
            () =>
              this.setState(state => ({
                _shouldShake: {
                  ...state._shouldShake,
                  [key]: false
                }
              })),
            500
          )
      );

    const clear = () => setMessage(NO_VALIDATION);

    const validate = () => {
      /*
      Some extra logic is added for this scenario:
      - We start with a field with a sync validation and an async one
      - User types good input (for sync and async) followed by bad input (for sync) in field with NO_ERROR
      - The validation for good input starts running
      - Validation for bad input starts running
      - Validation for bad input returns right away
      - Validation for good input returns later because async validation takes time

      The solution is to check that the validation message still applies by
      making sure that we only set the error message if the field value matches
      the value we had when the validation was triggered.
      */
      const toValidate = this.state[key];
      validateWithPromises(this.props.validations[key], toValidate).then(
        message => toValidate === this.state[key] && setMessage(message)
      );
    };

    const validateIfValidated = e =>
      this.setState(
        { [key]: e.target.value },
        () => this.state._messages[key] !== NO_VALIDATION && validate()
      );

    const validateIfNonEmpty = e => {
      this.state[key] ? validate() : clear();
    };

    const setRef = node => (this._refs[key] = node);

    const getProps = ({ onChange, onBlur, ...rest } = {}) => ({
      name: key,
      value: this.state[key], // You can extract state, but you can't set it
      onChange: compose(validateIfValidated, onChange),
      onBlur: compose(validateIfNonEmpty, onBlur),
      innerRef: setRef,
      ...rest
    });
    return {
      value: this.state[key],
      validate,
      validateValue: value => this.setState({ [key]: value }, validate),
      validateIfValidated,
      validateIfNonEmpty,
      ref: setRef,
      validationMessage: this.state._messages[key],
      shouldShake: this.state._shouldShake[key],
      watch: element => <element.type {...getProps(element.props)} />
    };
  };
  render = () => {
    const fieldHelpers = mapValidations(this.props.validations, key =>
      this._helpersForKey(key)
    );
    return this.props.render(fieldHelpers, {
      validateAll: this._validateAll
    });
  };
}

export const ValidatedForm = ({ onSubmit, render, ...props }) => (
  <Validated
    {...props}
    render={(fieldHelpers, generalHelpers) => (
      <form
        onSubmit={e => {
          e.preventDefault();
          generalHelpers.validateAll((fields, messages, isValid) => {
            onSubmit && onSubmit(fields, messages, isValid);
          });
        }}
      >
        {render(fieldHelpers, generalHelpers)}
      </form>
    )}
  />
);
