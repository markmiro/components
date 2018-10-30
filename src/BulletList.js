import React, { useReducer, useEffect, useState } from "react";
import styled from "styled-components";
import hashEmoji from "hash-emoji";
import PlainContentEditable from "./PlainContentEditable";
import { reducer, initialState, treeFuncs } from "./NodeTree";
import { ButtonPrimary, VerticalSpacer } from "./FormComponents";

const Id = styled.div`
  text-align: right;
  overflow: hidden;
  white-space: nowrap;
`;

const BulletContainer = styled.span`
  padding-top: 0.25em;
  padding-bottom: 0.25em;
  display: flex;
  background-color: ${({ isSelected }) => (isSelected ? "#0000ff22" : null)};
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #d4d4d4;
  padding-top: 1em;
`;

const Dot = styled.span`
  &:after {
    content: "•";
    margin-right: 0.5em;
  }
`;

function Bullet({ id, bulletState, dispatch, isSelectingMultipleLines }) {
  const { label, isSelected } = bulletState;

  const onChange = label => dispatch({ type: "CHANGE_LABEL", label, id });
  const addNodeBelow = id => dispatch({ type: "ADD_NODE_BELOW", id });
  const removeSelected = () => dispatch({ type: "REMOVE_SELECTED", id });
  const unindentSelected = () => dispatch({ type: "UNINDENT_SELECTED" });
  const indentSelected = () => dispatch({ type: "INDENT_SELECTED" });

  return (
    <div>
      <BulletContainer
        title={id}
        isSelected={isSelected && isSelectingMultipleLines}
      >
        {/* {isCollapsed ? "+" : "−"} */}
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
      </BulletContainer>
      <div style={{ marginLeft: "2em" }}>
        {treeFuncs.mapValues(bulletState.tree, ({ id }) => (
          <Bullet
            key={id}
            id={id}
            isSelectingMultipleLines={isSelectingMultipleLines}
            bulletState={treeFuncs.getNode(bulletState.tree, id)}
            dispatch={dispatch}
          />
        ))}
      </div>
    </div>
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

  const isSelectingMultipleLines =
    state.selectionStartId !== state.selectionEndId;

  return (
    <VerticalSpacer
      space="2em"
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
      <h1>Bullet List</h1>
      <div>
        {treeFuncs.mapValues(state.tree, ({ id }) => (
          <Bullet
            key={id}
            id={id}
            isSelectingMultipleLines={isSelectingMultipleLines}
            bulletState={treeFuncs.getNode(state.tree, id)}
            dispatch={dispatchProxy}
          />
        ))}
      </div>
      <Footer>
        Start: {hashEmoji(state.selectionStartId)}, End:
        {hashEmoji(state.selectionEndId)}, isReversed:
        {String(!state.isFromIndexHigher)}
        <ButtonPrimary style={{ width: "inherit" }}>Save</ButtonPrimary>
      </Footer>
    </VerticalSpacer>
  );
}

export default BulletList;
