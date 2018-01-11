import React, { Component } from "react";
import {
  isEqual,
  mapValues,
  forEach,
  includes,
  isFunction,
  isEmpty,
  castArray,
  first,
  omit,
  findKey
} from "lodash";
import {
  areAllValid,
  normalizeValidations,
  mapValidations,
  validateWithPromises,
  validateAllExceptPromises
} from "./validationRunner";
import { trace } from "./globals";

const EMPTY_VALUE = "";
const NO_ERROR = "";
const NO_VALIDATION = null;

// return new function that takes an argument and passes it down to all functions
const compose = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

/*
TODO:
- Fix debounced validations being impossible
- Support being controlled or uncontrolled (for field values and messages)
- Use `shouldComponentUpdate` to prevent wasted renders
- If user focuses a field, typed bad input, then presses ENTER key, then we want
  to highlight that field rather than the first one with an error.
- Fix bug where wrong input is highlighted when a set of fields each have
  an array of validations. It looks like we go through the first item in each
  array and highlight the first field with an error. If there are no errors,
  then we go to the next item in each array and repeat.

  However, it's not so bad since we focus the field that is most wrong since you
  usually set "required" validation for each input and then the actual
  validation. This way we encourage users to complete the form and then fix
  little errors and mistakes. Then again, we don't make this philosophy explicit
  anywhere else such as by showing an error on only the wrong field.

DOUBLECHECK:
- Dependent field validation. Maybe we should validate all fields on input and
  only show errors for current field? The downside is it's a lot of validation
  to be doing. But maybe not doing it would be premature optimization.
- It used to be designed so that form submission validates in realtime where
  validation messages are displayed as soon as they're resolved. The upside is
  that users get to see messages right away and can fix some problems while
  other fields are being processed. The downside is you may end up getting
  errors appearing for a different field while you're still typing to fix an
  error in the one you're in. It may stress people out. It may be better to
  only show errors when all the async validations resolve.

  If we show errors as they're resolved then individual fields should be in a
  "validating" state until they're resolved. If we wait until all are resolved
  then it's best to put the form in a "validating" state (and therefore
  disabled) until all validations are resolved.

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
      _isValidating: mapValidations(props.validations, () => false),
      _isValidatingAll: false,
      _keyFocused: null
    };
  }
  fields = () =>
    omit(this.state, [
      "_messages",
      "_shouldShake",
      "_isValidating",
      "_isValidatingAll",
      "_keyFocused"
    ]);
  _validateAll = onValidate => {
    // TODO: if there are already some messages then just highlight the first field with a message
    this.setState({
      _keyFocused: null,
      _isValidatingAll: true,
      _shouldShake: mapValidations(this.props.validations, () => false)
    });
    const messages = validateAllExceptPromises(
      this.props.validations,
      this.fields()
    );
    const keyToFocus = findKey(messages, message => !!message);
    this._refs[keyToFocus] && this._refs[keyToFocus].focus();
    this.setState(
      {
        _messages: messages,
        // Shake the first one with an error
        _shouldShake: mapValidations(
          this.props.validations,
          key => key === keyToFocus
        ),
        _keyFocused: keyToFocus,
        _isValidatingAll: false
      },
      () => {
        onValidate(this.fields(), messages, areAllValid(messages));
      }
    );
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
          },
          _isValidating: {
            ...state._isValidating,
            [key]: false
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
      const validation = normalizeValidations(this.props.validations)(
        this.fields()
      )[key];
      this.setState({
        _isValidating: {
          ...this.state._isValidating,
          [key]: true
        }
      });
      validateWithPromises(validation, toValidate).then(
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

    const customProps = {
      validationMessage: this.state._messages[key],
      shouldShake: this.state._shouldShake[key],
      isValidating: this.state._isValidating[key],
      isValid: this.state._messages[key] === NO_ERROR
    };

    return {
      value: this.state[key],
      validate,
      validateValue: value => this.setState({ [key]: value }, validate),
      validateIfValidated,
      validateIfNonEmpty,
      ref: setRef,
      watch: element => <element.type {...getProps(element.props)} />,
      ...customProps,
      customProps
    };
  };
  render = () => {
    const fieldHelpers = mapValidations(this.props.validations, key =>
      this._helpersForKey(key)
    );
    const generalHelpers = {
      validateAll: this._validateAll,
      isValidating: this.state._isValidatingAll
    };
    return this.props.render(fieldHelpers, generalHelpers);
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
