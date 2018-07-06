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
  validate,
  validateAll
} from "./validationRunner";
import { trace } from "../globals";

const EMPTY_VALUE = "";
const NO_ERROR = "";
const NO_VALIDATION = null; // TODO: rename to UNTOUCHED?

// return new function that takes an argument and passes it down to all functions
const compose = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

const isDOMTypeElement = element =>
  React.isValidElement(element) && typeof element.type === "string";

/*
TODO:
- Prevent from breaking when rendered on the server
- Write unit tests (partially so I don't forget all the scenarios I want to cover)
- Assert that keys between props: controlledValues and validations match
- Fix debounced validations being impossible
- Support being controlled or uncontrolled (for field values and messages)
- Use `shouldComponentUpdate` to prevent wasted renders
- If user focuses a field, typed bad input, then presses ENTER key, then we want
  to highlight that field rather than the first one with an error.
- Verify that it works with radio buttons

- TODO V2:
- Don't validate if blur caused by switching windows
- Make it obvious if a field contains only whitespace
- Internationalization?
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
- Optional fields work
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
    if (!this.props.render) {
      throw new Error(`
        <Validated /> expects a "render" prop.
        Example:
        <Validated
          render={() => <div>Hello</div>}
        />
      `);
      return;
    }
    if (!this.props.validations) {
      throw new Error(`
        <Validated /> expects a "validations" prop.
        Example:
        <Validated
          validations={{ over18 => over18 > 17 ? '' : 'Too young' }}
          render={({ over18 }) => <div>Hello</div>}
        />
      `);
      return;
    }
    this._validateAll = this._validateAll.bind(this);
    this._refs = mapValidations(this.props.validations, () =>
      React.createRef()
    );
    this.state = this._emptyState();
  }
  _emptyState = () => {
    const empty = mapValidations(this.props.validations, () => EMPTY_VALUE);
    return {
      ...empty,
      ...this.props.initialValues, // Since state keys are defined by consumer, we need a name that can't conflict
      _messages: mapValidations(this.props.validations, () => NO_VALIDATION),
      _shouldShake: mapValidations(this.props.validations, () => ""),
      _keyFocused: null
    };
  };
  _reset = () => this.setState(this._emptyState);
  fields = () => ({
    ...omit(this.state, ["_messages", "_shouldShake", "_keyFocused"]),
    ...this.props.controlledValues
  });
  _setValidationMessages = (messages, onSetStateDone = () => {}) => {
    // TODO: if there are already some messages then just highlight the first field with a message
    this.setState({
      _keyFocused: null,
      _shouldShake: mapValidations(this.props.validations, () => false)
    });
    const keyToFocus = findKey(messages, message => !!message);
    const elementToFocus = this._refs[keyToFocus];
    elementToFocus && elementToFocus.current && elementToFocus.current.focus();
    this.setState(
      {
        _messages: messages, // Shake the first one with an error
        _shouldShake: mapValidations(
          this.props.validations,
          key => key === keyToFocus
        ),
        _keyFocused: keyToFocus
      },
      onSetStateDone
    );
  };
  _areAllValid = () =>
    areAllValid(validateAll(this.props.validations, this.fields()));
  _validateAll = onValidate => {
    const messages = validateAll(this.props.validations, this.fields());
    this._setValidationMessages(
      messages,
      () =>
        onValidate && onValidate(this.fields(), messages, areAllValid(messages))
    );
  };
  _helpersForKey = key => {
    const isControlled = () =>
      this.props.controlledValues &&
      this.props.controlledValues[key] !== undefined;
    const getValue = () => this.fields()[key];
    const setMessage = message =>
      this.setState(
        state => ({
          _messages: { ...state._messages, [key]: message },
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

    const validateField = () => {
      console.log("validateField()");
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
      const validation = normalizeValidations(this.props.validations)(
        this.fields()
      )[key];
      setMessage(validate(validation, getValue()));
    };

    const validateIfValidated = eventOrValue => {
      const validateIfValidatedForReal = () => {
        console.log(
          "validateIfValidatedForReal()",
          `this.state._messages[${key}]: `,
          this.state._messages[key]
        );
        this.state._messages[key] !== NO_VALIDATION && validateField();
      };

      if (isControlled()) {
        validateIfValidatedForReal();
      } else {
        if (
          eventOrValue &&
          eventOrValue.constructor &&
          eventOrValue.constructor.name === "SyntheticEvent"
        ) {
          const event = eventOrValue;
          const value =
            event.target.type === "checkbox"
              ? event.target.checked
              : event.target.value;
          console.log(
            "validateIfValidated() constructor:",
            eventOrValue.constructor.name,
            "value:",
            value
          );
          this.setState({ [key]: value }, validateIfValidatedForReal);
        } else {
          const value = eventOrValue;
          this.setState({ [key]: value }, validateIfValidatedForReal);
        }
      }
    };

    const validateIfNonEmpty = e => {
      getValue() && validateField();
    };

    const getProps = element => {
      const { onChange, onBlur, ...rest } = element.props;
      if (element.props.type === "radio") {
        throw new Error(`
          Validating a single radio input isn't supported. To validate a radio group,
          create a component that displays a list of radio options and has an external API
          similar to a <select />.

          Longhand Example:

          render={({ myField }) =>
            <form>
              <MyBasicRadioGroup
                innerRef={myField.ref}
                value={myField.value}
                onChange={value => myField.validateValue(value)}
                radioOptions={{
                  optionId1: 'The first option',
                  optionId2: 'The second option',
                  optionId3: 'The third option'
                }}
              />
              {myField.validationMessage}
            </form>
          }

          Shorthand Example:

          render={({ myField }) =>
            myField.watch(
              <MyFancyRadioGroup
                radioOptions={{
                  optionId1: 'The first option',
                  optionId2: 'The second option',
                  optionId3: 'The third option'
                }}
              />
            )
          )}
        `);
      }
      // Need to cast to bool since otherwise we'll get `undefined` and therefore
      // React warnings about uncontrolled `checked` being changed to a controlled input
      const value =
        element.props.type === "checkbox"
          ? { checked: !!getValue() }
          : { value: getValue() };
      return {
        name: key,
        ...value,
        [isDOMTypeElement(element) ? "ref" : "innerRef"]: this._refs[key],
        onChange: compose(
          validateIfValidated,
          onChange
        ),
        onBlur: compose(
          validateIfNonEmpty,
          onBlur
        ),
        ...rest
      }; // You can extract state, but you can't set it
    };

    const customProps = {
      validationMessage: this.state._messages[key],
      shouldShake: this.state._shouldShake[key],
      isValid: this.state._messages[key] === NO_ERROR
    };

    return {
      value: getValue(),
      checked: getValue(),
      validateField,
      validateValue: value => this.setState({ [key]: value }, validateField),
      validateIfValidated,
      validateIfNonEmpty,
      ref: this._refs[key],
      ...customProps,
      watch: element => <element.type {...getProps(element)} />,
      watchFull: element => (
        <element.type {...customProps} {...getProps(element)} />
      )
    };
  };
  render = () => {
    const fieldHelpers = mapValidations(this.props.validations, key =>
      this._helpersForKey(key)
    );
    const generalHelpers = {
      setValidationMessages: this._setValidationMessages,
      areAllValid: this._areAllValid,
      validateAll: this._validateAll,
      reset: this._reset
    };
    return this.props.render(fieldHelpers, generalHelpers);
  };
}

export const ValidatedForm = ({ onSubmit, render, ...props }) => (
  <Validated
    {...props}
    render={(fieldHelpers, generalHelpers) => (
      <form
        novalidate // because we're doing custom validation
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
