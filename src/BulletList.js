import React, { useReducer, useEffect, useState } from "react";
import styled from "styled-components";
import hashEmoji from "hash-emoji";
import PlainContentEditable from "./PlainContentEditable";
import { reducer, initialState, treeFuncs } from "./NodeTree";

const Id = styled.div`
  font-family: monospace;
  width: 7em;
  font-size: 0.75em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  align-self: center;
  text-align: right;
`;

const Box = styled.span`
  &:hover {
    outline: 1px solid #0000ff22;
  }
  &:focus-within {
    // background: #0000ff11;
  }
`;

const Dot = styled.span`
  &:after {
    content: "•";
    margin-right: 0.3em;
  }
`;

function Bullet({ id, bulletState, dispatch }) {
  const { label, indentLevel, isSelected, isCollapsed } = bulletState;

  const onChange = label => dispatch({ type: "CHANGE_LABEL", label, id });
  const addNodeBelow = id => dispatch({ type: "ADD_NODE_BELOW", id });
  const removeSelected = () => dispatch({ type: "REMOVE_SELECTED", id });
  const unindentSelected = () => dispatch({ type: "UNINDENT_SELECTED" });
  const indentSelected = () => dispatch({ type: "INDENT_SELECTED" });

  return (
    <Box
      title={id}
      style={{
        display: "flex",
        marginLeft: `${indentLevel * 2}em`,
        background: isSelected && "#0000ff11"
      }}
    >
      {isCollapsed ? "+" : "−"}
      <Dot />
      <PlainContentEditable
        className="no-focus-box"
        data-id={id}
        value={label}
        onChange={onChange}
        onInput={e => {
          e.key === "Backspace" && !label && removeSelected();
          if (e.shiftKey && e.key === "Tab") {
            unindentSelected();
          } else if (e.key === "Tab") {
            indentSelected();
          }
          e.key === "Enter" && addNodeBelow(id);
        }}
        style={{ width: "100%" }}
      />
      <Id title={id}>
        {hashEmoji(label)}
        {hashEmoji(id)}
      </Id>
    </Box>
  );
}

function BulletList() {
  const ref = React.createRef();
  const [isMouseDown, setMouseDown] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(
    () => {
      document.addEventListener("mouseup", handleMouseUp);
      const id = state.selectionStartId;
      if (!isMouseDown && id) {
        console.log(
          "select",
          id,
          ref.current.querySelector(`[data-id="${id}"]`),
          state
        );
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(ref.current.querySelector(`[data-id="${id}"]`), 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
      return () => document.removeEventListener("mouseup", handleMouseUp);
    },
    [state.selectionStartId, state.selectionEndId]
  );

  function handleMouseUp() {
    setMouseDown(false);
  }

  function dispatchProxy(action) {
    dispatch(action);
    switch (action.type) {
      case "ADD_NODE_BELOW":
        focus(action.id);
      default:
        break;
    }
  }

  return (
    <div
      ref={ref}
      onKeyDown={e => {
        e.key === "ArrowUp" &&
          dispatch({ type: e.shiftKey ? "SHIFT_UP" : "CURSOR_UP" });
        e.key === "ArrowDown" &&
          dispatch({ type: e.shiftKey ? "SHIFT_DOWN" : "CURSOR_DOWN" });
      }}
      onKeyUp={e => {
        const isSelectingMultipleLines =
          state.selectionStartId !== state.selectionEndId;
        if (e.key === "Backspace" && isSelectingMultipleLines) {
          dispatch({ type: "REMOVE_SELECTED" });
        }
      }}
      onMouseDown={e => {
        const id = document.elementFromPoint(e.clientX, e.clientY).dataset.id;
        dispatch({ type: "SELECT", fromId: id, toId: id });
        setMouseDown(true);
      }}
      onMouseMove={e => {
        if (isMouseDown) {
          const id = document.elementFromPoint(e.clientX, e.clientY).dataset.id;
          dispatch({ type: "SELECT", toId: id });
          if (state.selectionStartId !== state.selectionEndId) {
            window.getSelection().removeAllRanges();
          }
        }
      }}
    >
      {treeFuncs.mapValues(state.tree, ({ id }) => (
        <Bullet
          key={id}
          id={id}
          bulletState={treeFuncs.getNode(state.tree, id)}
          dispatch={dispatchProxy}
        />
      ))}
      Start: {hashEmoji(state.selectionStartId)}, End:{" "}
      {hashEmoji(state.selectionEndId)}, isReversed:{" "}
      {String(!state.isFromIndexHigher)}
    </div>
  );
}

export default BulletList;
