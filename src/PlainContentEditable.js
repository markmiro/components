import React, { Component } from "react";
import styled from "styled-components";

const ContentEditable = styled.div`
  &:focus {
    box-shadow: none !important;
  }
`;

function toEditorEvent(event) {
  // https://css-tricks.com/snippets/javascript/test-mac-pc-javascript/
  const isCmdKey = e => {
    const isMac = () => navigator.userAgent.indexOf("Mac OS X") > -1;
    return isMac() ? e.metaKey : e.ctrlKey;
  };

  const isModifierKey = key =>
    ["Shift", "Meta", "Alt", "Control"].includes(key);

  const getKeyComboString = e => {
    let keyCombo = [];
    if (isCmdKey(e)) keyCombo.push("Cmd");
    if (e.shiftKey) keyCombo.push("Shift");
    if (e.altKey) keyCombo.push("Alt");
    if (!isModifierKey(e.key)) keyCombo.push(e.key);
    return keyCombo.join("+");
  };

  const comboString = getKeyComboString(event);

  const isBlockedKeyCombo = () => ["Cmd+b", "Cmd+i"].includes(comboString);

  return { comboString, isBlockedKeyCombo, isModifierKey };
}

// Prevents insertion of HTML
// Much of the code here can be removed once `contentEditable="plaintext-only"`
// is standardized and widely supported.
// https://w3c.github.io/editing/contentEditable.html
export default class PlainContentEditable extends Component {
  cursorRange = {};
  componentDidMount = () => {
    this.observer = new MutationObserver(mutations => {
      mutations
        .filter(mutation => mutation.type === "characterData")
        .forEach(mutation => {
          // console.log("mutation", mutation.target.data);
          this.props.onChange(mutation.target.data);
        });
    });
    const config = { characterData: true };
    this.observer.observe(this.textNode, config);
  };
  componentWillUnmount = () => this.observer.disconnect();
  // This prevents the `value` prop from being updated, but the alternative
  // is that the component will be re-rendered and the cursor position would
  // be lost. Therefore,
  shouldComponentUpdate = (nextProps, nextState) => {
    return (
      nextProps.value !== this.textNode.data &&
      nextProps.value !== this.props.value
    );
  };
  handleInputKeyDown = e => {
    const editorEvent = toEditorEvent(e);
    // console.log("Key combo", editorEvent.comboString);
    if (editorEvent.isBlockedKeyCombo() || e.key === "Enter") {
      // console.log("prevent");
      e.preventDefault();
    }
  };
  handlePaste = e => {
    // https://stackoverflow.com/a/12028136
    e.preventDefault();
    const pasteText = e.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, pasteText);
  };
  render() {
    return (
      <ContentEditable
        contentEditable
        onKeyDown={this.handleInputKeyDown}
        onClick={this.selectAll}
        onPaste={this.handlePaste}
        // Get the singular text node
        // Also, using `textNode.data`, because: https://stackoverflow.com/a/12287159
        innerRef={el => (this.textNode = el && el.childNodes[0])}
        dangerouslySetInnerHTML={{ __html: this.props.value }}
      />
    );
  }
}
