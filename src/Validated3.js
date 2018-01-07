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

    // TODO: sometimes updates are out of sync
    const validate = () =>
      validateWithPromises(this.props.validations[key], this.state[key]).then(
        setMessage
      );

    const validateIfInvalid = e =>
      this.setState({ [key]: e.target.value }, state => {
        if (![NO_VALIDATION, NO_ERROR].includes(this.state._messages[key])) {
          validate();
        }
      });

    const validateIfNonEmpty = e => {
      this.state[key] ? validate() : clear();
    };

    const setRef = node => (this._refs[key] = node);

    const getProps = ({ onChange, onBlur, ...rest } = {}) => ({
      name: key,
      value: this.state[key], // You can extract state, but you can't set it
      onChange: compose(validateIfInvalid, onChange),
      onBlur: compose(validateIfNonEmpty, onBlur),
      innerRef: setRef,
      ...rest
    });
    return {
      value: this.state[key],
      validate,
      validateValue: value => this.setState({ [key]: value }, validate),
      validateIfInvalid,
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
