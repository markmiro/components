import React, { Component } from "react";

// https://css-tricks.com/snippets/javascript/test-mac-pc-javascript/
const isCmdKeyDown = e => {
  const isMac = () => navigator.userAgent.indexOf("Mac OS X") > -1;
  return isMac() ? e.metaKey : e.ctrlKey;
};

function toEditorEvent(event) {
  const isModifierKey = key =>
    ["Shift", "Meta", "Alt", "Control"].includes(key);

  const getKeyComboString = e => {
    let keyCombo = [];
    if (isCmdKeyDown(e)) keyCombo.push("Cmd");
    if (e.shiftKey) keyCombo.push("Shift");
    if (e.altKey) keyCombo.push("Alt");
    if (!isModifierKey(e.key)) keyCombo.push(e.key);
    return keyCombo.join("+");
  };

  const comboString = getKeyComboString(event);

  // Prevent bold and italic text
  const isBlockedKeyCombo = () => ["Cmd+b", "Cmd+i"].includes(comboString);

  return { comboString, isBlockedKeyCombo, isModifierKey };
}

// Prevents insertion of HTML
// Much of the code here can be removed once `contentEditable="plaintext-only"`
// is standardized and widely supported.
// https://w3c.github.io/editing/contentEditable.html
export default class PlainContentEditable extends Component {
  componentDidMount = () => {
    this.observer = new MutationObserver(mutations => {
      mutations
        .filter(mutation => mutation.type === "characterData")
        .forEach(mutation => {
          // console.log("mutation", mutation.target.data);
          this.props.onChange(mutation.target.data);
        });
    });
    const config = { characterData: true, subtree: true };
    this.observer.observe(this.el, config);
  };
  componentWillUnmount = () => this.observer && this.observer.disconnect();
  // This prevents the `value` prop from being updated, but the alternative
  // is that the component will be re-rendered and the cursor position would
  // be lost. Therefore,
  shouldComponentUpdate = (nextProps, nextState) => {
    return (
      nextProps.value !== this.el.textContent &&
      nextProps.value !== this.props.value
    );
  };
  handleInputKeyDown = e => {
    const editorEvent = toEditorEvent(e);
    // console.log("Key combo", editorEvent.comboString);
    if (
      editorEvent.isBlockedKeyCombo() ||
      e.key === "Enter" ||
      e.key === "Tab"
    ) {
      // console.log("prevent");
      e.preventDefault();
    }
    this.props.onInput && this.props.onInput(e);
  };
  handlePaste = e => {
    // https://stackoverflow.com/a/12028136
    e.preventDefault();
    const pasteText = e.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, pasteText);
  };
  render() {
    // NOTE: intentionally not using `onInput` and onChange`.
    // They're used elsewhere.
    const { onInput, onChange, value, innerRef, ...rest } = this.props;
    return (
      <div
        contentEditable
        onKeyDown={this.handleInputKeyDown}
        onPaste={this.handlePaste}
        ref={el => {
          this.el = el;
          innerRef(el);
        }}
        dangerouslySetInnerHTML={{ __html: value }}
        {...rest}
      />
    );
  }
}
