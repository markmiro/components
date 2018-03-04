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

  const shouldSanitizeKeyCombo = () =>
    ["Cmd+v", "Cmd+Shift+v"].includes(comboString);

  const isBlockedKeyCombo = () => ["Cmd+b", "Cmd+i"].includes(comboString);

  return {
    comboString,
    shouldSanitizeKeyCombo,
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
    // TODO: paste only plain text
    if (editorEvent.isBlockedKeyCombo() || e.key === "Enter") {
      console.log("prevent");
      e.preventDefault();
    }
  };
  handlePaste = e => {
    // TODO: we lose undo history because we do paste ourselves
    // Don't let browser handle paste (it will try to paste HTML some)
    e.preventDefault();
    console.log("paste");
    console.log(e.clipboardData.getData("text"));
    console.log(e.target);
    // https://stackoverflow.com/a/3976125
    function getCaretPosition(editableDiv) {
      let caretPos = { start: 0, end: 0 };
      let sel;
      let range;
      if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
          range = sel.getRangeAt(0);
          if (range.commonAncestorContainer.parentNode == editableDiv) {
            caretPos = {
              start: range.startOffset,
              end: range.endOffset
            };
          }
        }
      }
      return caretPos;
    }

    console.log(getCaretPosition(e.target));
    const range = getCaretPosition(e.target);
    const clipboardText = e.clipboardData.getData("text");
    const before = this.inputEl.textContent.slice(0, range.start);
    const after = this.inputEl.textContent.slice(range.end);
    console.log(before, clipboardText, after);
    this.inputEl.textContent = before + clipboardText + after;

    // Move cursor to end of pasted content
    const inputElTextNode = this.inputEl.childNodes[0];
    const selectRange = document.createRange();
    selectRange.setStart(inputElTextNode, range.start + clipboardText.length);
    selectRange.collapse();
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(selectRange);
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
