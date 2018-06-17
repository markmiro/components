import React from "react";
import Validated from "./Validated";
import { shallow, mount } from "enzyme";

describe.only("<Validated />", () => {
  it("renders without crashing", () => {
    shallow(
      <Validated
        validations={{
          bla: () => {}
        }}
        render={({ bla }) => <div>Hello</div>}
      />
    );
  });

  // it("should work with radio buttons", () => {});

  // it("should work with checkboxes", () => {});

  // it("should work with checkboxes", () => {});

  // it("should work with select", () => {});

  // it("should work with textarea", () => {});

  it("works when spelling everything out", () => {
    const wrapper = mount(
      <Validated
        validations={{
          isRequired: input => {
            console.log("isRequired() input: '", input, "'");
            return input ? "" : "Required";
          }
        }}
        render={({ isRequired }) => {
          console.log(
            "render() value: '",
            isRequired.value,
            "' errors: '",
            isRequired.validationMessage,
            "'"
          );
          return (
            <form>
              <input
                className={isRequired.shouldShake ? "shake" : ""}
                ref={isRequired.ref}
                value={isRequired.value}
                onChange={e => {
                  console.log("onChange() value: '", e.target.value, "'");
                  isRequired.validateIfValidated(e);
                }}
                onBlur={() => {
                  console.log("onBlur()");
                  isRequired.validateIfNonEmpty();
                }}
              />
              {isRequired.isValid ? "valid" : ""}
              <div className="error">{isRequired.validationMessage}</div>
            </form>
          );
        }}
      />
    );
    const isRequiredSpy = jest.spyOn(wrapper.prop("validations"), "isRequired");
    const inputValue = "spam";

    // Focus then blur, validate that error doesn't get show up
    wrapper.find("input").simulate("change", { target: { value: "" } });
    wrapper.find("input").simulate("blur");
    expect(wrapper.find(".error").text()).toBe("");

    // Type "spam", verify that validation didn't start yet
    wrapper.find("input").simulate("change", { target: { value: inputValue } });
    expect(wrapper.find("input").prop("value")).toBe(inputValue);
    expect(wrapper.find(".error").text()).toBe("");

    // Blur, verify that input is validated
    wrapper.find("input").simulate("blur");
    expect(isRequiredSpy).toBeCalledWith(inputValue);
    expect(wrapper.find(".error").text()).toBe("");

    // Type "", validate that error shows up immediately
    wrapper.find("input").simulate("change", { target: { value: "" } });
    expect(isRequiredSpy).toBeCalledWith("");
    expect(wrapper.find("input").prop("value")).toBe("");
    expect(wrapper.find(".error").text()).toBe("Required");

    // Type "spam", verify that error immediately disappears again
    wrapper.find("input").simulate("change", { target: { value: inputValue } });
    expect(isRequiredSpy).toBeCalledWith(inputValue);
    expect(wrapper.find(".error").text()).toBe("");

    expect(isRequiredSpy).toHaveBeenCalledTimes(3);
  });

  it("works with the shorthand way", () => {
    const wrapper = mount(
      <Validated
        validations={{
          isRequired: input => {
            console.log("isRequired() input: '", input, "'");
            return input ? "" : "Required";
          }
        }}
        render={({ isRequired }) => {
          console.log(
            "render() value: '",
            isRequired.value,
            "' errors: '",
            isRequired.validationMessage,
            "'"
          );
          return (
            <form>
              {isRequired.watch(<input />)}
              {isRequired.isValid ? "valid" : ""}
              <div className="error">{isRequired.validationMessage}</div>
            </form>
          );
        }}
      />
    );
    const isRequiredSpy = jest.spyOn(wrapper.prop("validations"), "isRequired");
    const inputValue = "spam";

    // Focus then blur, validate that error doesn't get show up
    wrapper.find("input").simulate("change", { target: { value: "" } });
    wrapper.find("input").simulate("blur");
    expect(wrapper.find(".error").text()).toBe("");

    // Type "spam", verify that validation didn't start yet
    wrapper.find("input").simulate("change", { target: { value: inputValue } });
    expect(wrapper.find("input").prop("value")).toBe(inputValue);
    expect(wrapper.find(".error").text()).toBe("");

    // Blur, verify that input is validated
    wrapper.find("input").simulate("blur");
    expect(isRequiredSpy).toBeCalledWith(inputValue);
    expect(wrapper.find(".error").text()).toBe("");

    // Type "", validate that error shows up immediately
    wrapper.find("input").simulate("change", { target: { value: "" } });
    expect(isRequiredSpy).toBeCalledWith("");
    expect(wrapper.find("input").prop("value")).toBe("");
    expect(wrapper.find(".error").text()).toBe("Required");

    // Type "spam", verify that error immediately disappears again
    wrapper.find("input").simulate("change", { target: { value: inputValue } });
    expect(isRequiredSpy).toBeCalledWith(inputValue);
    expect(wrapper.find(".error").text()).toBe("");

    expect(isRequiredSpy).toHaveBeenCalledTimes(3);
  });

  it("doesn't check for errors on change", () => {});

  it("checks errors on blur", () => {});

  it("checks for success on change if there's already an error", () => {});

  it("checks for errors on change if there's already an error", () => {});

  it("doesn't allow async validations to cause non-async errors to disappear", () => {});

  // This should also scroll the window to the first input with an error
  it("shakes the first field that has an error, and focuses it on submit", () => {});

  // Ex: prefilled by props or state, or prefilled by something like a password manager
  it("should work with autofilling", () => {
    // Fields are filled in
    // Fields are validated
    // Checkmark shows on valid fields
    // Error messages show on bad fields
    // Mark fields at touched (in other words, autofilled fields should have either be in success or error state)
  });

  // Ex: "You have 5/240 characters left"
  it("shouldn't interfere with having a helpful note be displayed", () => {});

  // Ex: "sdf.sdf" is not a valid email
  it("can display the field value in the error message", () => {});

  // Ex: input same email twice
  it("should work with dependent fields", () => {});

  it("should add checkmark to valid fields", () => {});

  it("validates and displays messages for all fields on submit", () => {});

  it("sets async errors from server to correct fields and focuses first field on submit", () => {});

  it("prevents async errors from server being cleared until the next submit", () => {});

  // This is so we don't validate on every key press and therefore cause extra:
  // * re-rendering
  // * validation (especially since validation can be expensive)
  it("debounces error validation on change events", () => {});
});
