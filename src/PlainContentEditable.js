import React, { Component } from "react";
import styled from "styled-components";

const ContentEditable = styled.div`
  &:focus {
    border: 0;
  }
`;

function toEditorEvent(event) {
  // https://css-tricks.com/snippets/javascript/test-mac-pc-javascript/
  const isCmdKey = e => {
    const isMac = () => navigator.userAgent.indexOf("Mac OS X") > -1;
    return isMac() ? e.metaKey : e.ctrlKey;
  };

  const getKeyComboString = e => {
    let keyCombo = [];
    if (isCmdKey(e)) keyCombo.push("Cmd");
    if (e.shiftKey) keyCombo.push("Shift");
    if (e.altKey) keyCombo.push("Alt");
    if (!["Shift", "Meta", "Alt", "Control"].includes(e.key))
      keyCombo.push(e.key);
    return keyCombo.join("+");
  };

  const comboString = getKeyComboString(event);

  const isBlockedKeyCombo = () => ["Cmd+b", "Cmd+i"].includes(comboString);

  return {
    comboString,
    isBlockedKeyCombo
  };
}

export default class PlainContentEditable extends Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.initialValue };
  }
  sanitize = () => {
    console.log(this.inputEl.textContent);
    this.inputEl.innerHTML = this.inputEl.textContent;
  };
  handleInputKeyDown = e => {
    const editorEvent = toEditorEvent(e);
    console.log("Key combo", editorEvent.comboString);
    if (editorEvent.isBlockedKeyCombo() || e.key === "Enter") {
      console.log("prevent");
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
        onInput={e => this.props.onChange(e.target.textContent)}
        onPaste={this.handlePaste}
        innerRef={el => (this.inputEl = el)}
      >
        {this.props.initialValue}
      </ContentEditable>
    );
  }
}
