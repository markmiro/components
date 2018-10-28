import React from "react";
import Validated from "./Validated";
import { shallow, mount } from "enzyme";
import ReactDOM from "react-dom";

// TODO: enhance validation tests by checking if "checkmark" is also being displayed
// TODO: enhance validation tests by testing with composite components like `ValidatedInput`

const NO_ERROR = { empty: true };
const NO_VALIDATION = null;
const NO_ERROR_STR = JSON.stringify(NO_ERROR);
const NO_VALIDATION_STR = JSON.stringify(NO_VALIDATION);
const ERROR = "Required";
const isRequired = input => (input ? NO_ERROR : ERROR);
const ERROR_STR = JSON.stringify(ERROR);

describe("JSDOM", () => {
  it("works", () => {
    document.body.innerHTML = "Hi";
    expect(document.body.textContent).toMatch("Hi");
  });
});

describe("<Validated />", () => {
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

  describe("Basic `onChange`, `onBlur`, `onSubmit`", () => {
    describe("For fields that use `checked`", () => {
      function testWrapperForBlurAndChangeOnField(reactElement) {
        const wrapper = mount(reactElement);
        const isRequiredSpy = jest.spyOn(
          wrapper.prop("validations"),
          "isRequired"
        );
        const inputValue = true;

        // Focus then blur, validate that error doesn't get show up
        wrapper
          .find(".formField")
          .simulate("change", { type: "checkbox", target: { checked: false } });
        wrapper.find(".formField").simulate("blur");
        expect(wrapper.find(".error").text()).toBe(NO_VALIDATION_STR);

        // Input "checked: true", verify that validation didn't start yet
        wrapper
          .find(".formField")
          .simulate("change", { target: { type: "checkbox", checked: true } });
        expect(wrapper.find(".formField").prop("checked")).toBe(inputValue);
        expect(wrapper.find(".error").text()).toBe(NO_VALIDATION_STR);

        // Blur, verify that input is validated
        wrapper.find(".formField").simulate("blur");
        expect(isRequiredSpy).toBeCalledWith(inputValue);
        expect(wrapper.find(".error").text()).toBe(NO_ERROR_STR);

        // Input "checked: false", validate that error shows up immediately
        wrapper
          .find(".formField")
          .simulate("change", { target: { type: "checkbox", checked: false } });
        expect(isRequiredSpy).toBeCalledWith(false);
        expect(wrapper.find(".formField").prop("checked")).toBe(false);
        expect(wrapper.find(".error").text()).toBe(ERROR_STR);

        // Input "checked: true", verify that error immediately disappears again
        wrapper.find(".formField").simulate("change", {
          target: { type: "checkbox", checked: inputValue }
        });
        expect(isRequiredSpy).toBeCalledWith(inputValue);
        expect(wrapper.find(".error").text()).toBe(NO_ERROR_STR);

        expect(isRequiredSpy).toHaveBeenCalledTimes(3);
      }
      describe('<input type="checkbox" />', () => {
        it("works with shorthand way", () =>
          testWrapperForBlurAndChangeOnField(
            <Validated
              validations={{
                isRequired
              }}
              render={({ isRequired }) => (
                <form>
                  {isRequired.watch(
                    <input type="checkbox" className="formField" />
                  )}
                  {isRequired.isValid ? "valid" : ""}
                  <div className="error">
                    {JSON.stringify(isRequired.validationMessage)}
                  </div>
                </form>
              )}
            />
          ));
      });

      describe('<input type="radio" />', () => {
        it("throws an error", () =>
          expect(() =>
            shallow(
              <Validated
                validations={{
                  isRequired
                }}
                render={({ isRequired }) =>
                  isRequired.watch(<radio type="radio" className="formField" />)
                }
              />
            )
          ).toThrow("Validating a single radio input isn't supported"));
      });
    });

    describe("For fields that use `value`", () => {
      function testWrapperForBlurAndChangeOnField(reactElement) {
        const wrapper = mount(reactElement);
        const isRequiredSpy = jest.spyOn(
          wrapper.prop("validations"),
          "isRequired"
        );
        const inputValue = "spam";

        // Focus then blur, validate that error doesn't get show up
        wrapper
          .find(".formField")
          .simulate("change", { target: { value: "" } });
        wrapper.find(".formField").simulate("blur");
        expect(wrapper.find(".error").text()).toBe(NO_VALIDATION_STR);

        // Input "spam", verify that validation didn't start yet
        wrapper
          .find(".formField")
          .simulate("change", { target: { value: inputValue } });
        expect(wrapper.find(".formField").prop("value")).toBe(inputValue);
        expect(wrapper.find(".error").text()).toBe(NO_VALIDATION_STR);

        // Blur, verify that input is validated
        wrapper.find(".formField").simulate("blur");
        expect(isRequiredSpy).toBeCalledWith(inputValue);
        expect(wrapper.find(".error").text()).toBe(NO_ERROR_STR);

        // Input "", validate that error shows up immediately
        wrapper
          .find(".formField")
          .simulate("change", { target: { value: "" } });
        expect(isRequiredSpy).toBeCalledWith("");
        expect(wrapper.find(".formField").prop("value")).toBe("");
        expect(wrapper.find(".error").text()).toBe(ERROR_STR);

        // Input "spam", verify that error immediately disappears again
        wrapper
          .find(".formField")
          .simulate("change", { target: { value: inputValue } });
        expect(isRequiredSpy).toBeCalledWith(inputValue);
        expect(wrapper.find(".error").text()).toBe(NO_ERROR_STR);

        expect(isRequiredSpy).toHaveBeenCalledTimes(3);
      }

      describe("<input />", () => {
        it("works with longhand way", () =>
          testWrapperForBlurAndChangeOnField(
            <Validated
              validations={{
                isRequired
              }}
              render={({ isRequired }) => (
                <form>
                  <input
                    className="formField"
                    ref={isRequired.ref}
                    value={isRequired.value}
                    onChange={isRequired.validateIfValidated}
                    onBlur={isRequired.validateIfNonEmpty}
                  />
                  {isRequired.isValid ? "valid" : ""}
                  <div className="error">
                    {JSON.stringify(isRequired.validationMessage)}
                  </div>
                </form>
              )}
            />
          ));

        it("works with shorthand way", () =>
          testWrapperForBlurAndChangeOnField(
            <Validated
              validations={{
                isRequired
              }}
              render={({ isRequired }) => (
                <form>
                  {isRequired.watch(<input className="formField" />)}
                  {isRequired.isValid ? "valid" : ""}
                  <div className="error">
                    {JSON.stringify(isRequired.validationMessage)}
                  </div>
                </form>
              )}
            />
          ));
      });

      describe("<textarea />", () => {
        it("works with longhand way", () =>
          testWrapperForBlurAndChangeOnField(
            <Validated
              validations={{
                isRequired
              }}
              render={({ isRequired }) => (
                <form>
                  <textarea
                    className="formField"
                    ref={isRequired.ref}
                    value={isRequired.value}
                    onChange={isRequired.validateIfValidated}
                    onBlur={isRequired.validateIfNonEmpty}
                  />
                  {isRequired.isValid ? "valid" : ""}
                  <div className="error">
                    {JSON.stringify(isRequired.validationMessage)}
                  </div>
                </form>
              )}
            />
          ));

        it("works with shorthand way", () =>
          testWrapperForBlurAndChangeOnField(
            <Validated
              validations={{
                isRequired
              }}
              render={({ isRequired }) => (
                <form>
                  {isRequired.watch(<textarea className="formField" />)}
                  {isRequired.isValid ? "valid" : ""}
                  <div className="error">
                    {JSON.stringify(isRequired.validationMessage)}
                  </div>
                </form>
              )}
            />
          ));
      });

      describe("<select />", () => {
        function testWrapperForBlurAndChangeOnField(reactElement) {
          const wrapper = mount(reactElement);
          const isRequiredSpy = jest.spyOn(
            wrapper.prop("validations"),
            "isRequired"
          );
          const inputValue = "spam";

          // Focus then blur, validate that error doesn't get show up
          wrapper
            .find(".formField")
            .simulate("change", { target: { value: "" } });
          wrapper.find(".formField").simulate("blur");
          expect(wrapper.find(".error").text()).toBe(NO_VALIDATION_STR);

          // Input "spam", verify that validation didn't start yet
          wrapper
            .find(".formField")
            .simulate("change", { target: { value: inputValue } });
          expect(wrapper.find(".formField").prop("value")).toBe(inputValue);
          expect(wrapper.find(".error").text()).toBe(NO_VALIDATION_STR);

          // Blur, verify that input is validated
          wrapper.find(".formField").simulate("blur");
          expect(isRequiredSpy).toBeCalledWith(inputValue);
          expect(wrapper.find(".error").text()).toBe(NO_ERROR_STR);

          // Input "", validate that error shows up immediately
          wrapper
            .find(".formField")
            .simulate("change", { target: { value: "" } });
          expect(isRequiredSpy).toBeCalledWith("");
          expect(wrapper.find(".formField").prop("value")).toBe("");
          expect(wrapper.find(".error").text()).toBe(ERROR_STR);

          // Input "spam", verify that error immediately disappears again
          wrapper
            .find(".formField")
            .simulate("change", { target: { value: inputValue } });
          expect(isRequiredSpy).toBeCalledWith(inputValue);
          expect(wrapper.find(".error").text()).toBe(NO_ERROR_STR);

          expect(isRequiredSpy).toHaveBeenCalledTimes(3);
        }
        it("works with longhand way", () =>
          testWrapperForBlurAndChangeOnField(
            <Validated
              validations={{
                isRequired
              }}
              render={({ isRequired }) => (
                <form>
                  <select
                    className="formField"
                    ref={isRequired.ref}
                    value={isRequired.value}
                    onChange={isRequired.validateIfValidated}
                    onBlur={isRequired.validateIfNonEmpty}
                  >
                    <option value="">Nothing</option>
                    <option value="spam">Spam</option>
                  </select>
                  {isRequired.isValid ? "valid" : ""}
                  <div className="error">
                    {JSON.stringify(isRequired.validationMessage)}
                  </div>
                </form>
              )}
            />
          ));

        it("works with shorthand way", () =>
          testWrapperForBlurAndChangeOnField(
            <Validated
              validations={{
                isRequired
              }}
              render={({ isRequired }) => (
                <form>
                  {isRequired.watch(
                    <select className="formField">
                      <option value="">Nothing</option>
                      <option value="spam">Spam</option>
                    </select>
                  )}
                  {isRequired.isValid ? "valid" : ""}
                  <div className="error">
                    {JSON.stringify(isRequired.validationMessage)}
                  </div>
                </form>
              )}
            />
          ));
      });
    });
  });

  // it("doesn't allow async validations to cause non-async errors to disappear", () => {
  // });

  // // This should also scroll the window to the first input with an error
  it("shakes the first field that has an error, and focuses it on submit", () => {
    const isRequired = input => (input ? NO_ERROR : "Required");
    const targetNode = document.createElement("div");
    targetNode.setAttribute("id", "react-app");
    document.body.appendChild(targetNode);
    ReactDOM.render(
      <Validated
        validations={{
          fname: isRequired,
          lname: isRequired
        }}
        render={({ fname, lname }, { validateAll }) => (
          <form
            className="theForm"
            onSubmit={e => {
              e.preventDefault();
              validateAll();
            }}
          >
            {fname.shouldShake && "fname.shouldShake"}
            {fname.watch(<input className="formField1" />)}
            {lname.watch(<input className="formField2" />)}
            <button type="submit">Submit</button>
          </form>
        )}
      />,
      targetNode
    );

    document.querySelector("[type=submit]").click();
    expect(document.activeElement.className).toBe("formField1");
    expect(document.querySelector("form").innerHTML).toMatch(
      "fname.shouldShake"
    );
  });

  // // Ex: prefilled by props or state, or prefilled by something like a password manager
  // it("should work with autofilling", () => {
  //   // Fields are filled in
  //   // Fields are validated
  //   // Checkmark shows on valid fields
  //   // Error messages show on bad fields
  //   // Mark fields as touched (in other words, autofilled fields should have either be in success or error state)
  // });

  // // Ex: "You have 5/240 characters left"
  // it("shouldn't interfere with having a helpful note be displayed", () => {});

  it("can display the field value in the error message", () => {
    const isBlank = foobar => (foobar ? `${foobar} is not blank` : "");
    const reactElement = (
      <Validated
        validations={{
          foobar: isBlank
        }}
        render={({ foobar }) => (
          <form>
            {foobar.watch(<input className="formField" />)}
            <div className="error">{foobar.validationMessage}</div>
          </form>
        )}
      />
    );
    const wrapper = mount(reactElement);
    const inputValue = "blabla";
    wrapper
      .find(".formField")
      .simulate("change", { target: { value: inputValue } });
    wrapper.find(".formField").simulate("blur");
    expect(wrapper.find(".formField").prop("value")).toBe(inputValue);
    expect(wrapper.find(".error").text()).toBe(inputValue + " is not blank");
  });

  // // Ex: input same email twice
  // it("should work with dependent fields", () => {});

  // it("should add checkmark to valid fields", () => {});

  // it("validates and displays messages for all fields on submit", () => {});

  // it("sets async errors from server to correct fields and focuses first error field on submit", () => {});

  // it("prevents async errors from server being cleared until the next submit", () => {});

  // // This is so we don't validate on every key press and therefore cause extra:
  // // * re-rendering
  // // * validation (especially since validation can be expensive)
  // it("debounces error validation on change events", () => {});
});
