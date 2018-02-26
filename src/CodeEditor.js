import React, { Component } from "react";
import AceEditor from "react-ace";
import styled from "styled-components";
import brace from "brace";
import "brace/mode/javascript";
import "brace/theme/github";
import { createStore, applyMiddleware } from "redux";
import { connect, Provider } from "react-redux";

function onChange(newValue) {
  console.log("change", newValue);
}

const Value = styled.span`
  display: inline-block;
  padding: 0.1em 0.25em;
  margin: 0.2em;
  color: white;
  border-radius: 3px;
  background: rgba(0, 0, 200, 0.7);
`;

const NodeElement = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.5em 1em;
  cursor: default;
  user-select: none;
  position: relative;
  &:hover:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: rgba(0, 0, 200, 0.2);
  }
  background-color: ${props => (props.isSelected ? "rgba(0,0,200, 0.1)" : "")};
  border: ${props => (props.isSelected ? "1px solid rgba(0,0,200, 0.5)" : "")};
`;

const AddNodeElement = styled.div`
  cursor: pointer;
  font-size: 0.5em;
  padding: 0.2em;
  color: white;
  z-index: 1;
  background-color: rgba(10, 100, 50, 1);
  text-align: center;
  ${({ isBottom }) => (isBottom ? "bottom: 0" : undefined)};
  ${({ isTop }) => (isTop ? "top: 0" : undefined)};
  transform: translateY(${({ isBottom }) => (isBottom ? "50%" : undefined)});
  transform: translateY(${({ isTop }) => (isTop ? "-50%" : undefined)});

  ${({ isBottom, isTop }) =>
    (isBottom || isTop) &&
    `
    position: absolute;
    left: 0;
    right: 0;
    opacity: 0;
    &:hover {
      opacity: 1;
      transition-duration: 400ms;
    }
    transition-duration: 100ms;
    transition-property: opacity;
    transition-timing-function: ease-in-out;
  `};
`;

const AddNode = props => (
  <AddNodeElement onClick={e => e.stopPropagation()} {...props}>
    + Add node
  </AddNodeElement>
);

const NodeTag = styled.b`
  margin-right: 0.5em;
  cursor: pointer;
  &:hover {
    border-bottom: 1px solid black;
  }
`;

const initialState = { selected: undefined };

const selector = (state = initialState, action) => {
  switch (action.type) {
    case "SELECT":
      return {
        selected:
          state.selected === action.selected ? undefined : action.selected
      };
    default:
      return state;
  }
};

const store = createStore(
  selector,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

class Node extends Component {
  state = {
    active: false
  };
  constructor(props) {
    super(props);
    store.subscribe(() => this.forceUpdate());
  }
  handleClick = e => {
    e.stopPropagation();
    store.dispatch({ type: "SELECT", selected: this });
  };
  isSelected = () => {
    return store.getState().selected === this;
  };
  handleTagClick = e => {
    e.stopPropagation();
    if (this.isSelected()) {
    }
  };
  render() {
    const { tag, attrs = {}, children, count } = this.props;
    const isSelected = this.isSelected();
    return (
      <div style={{ position: "relative" }}>
        {isSelected && <AddNode />}
        <NodeElement onClick={this.handleClick} isSelected={isSelected}>
          <NodeTag onClick={this.handleTagClick}>{tag}</NodeTag>
          {Object.keys(attrs).map(key => (
            <span key={key}>
              {key} = <Value>{attrs[key]}</Value>
            </span>
          ))}
          <div>{children}</div>
        </NodeElement>
        {isSelected && <AddNode />}
      </div>
    );
  }
}

class CodeEditor extends Component {
  render() {
    return (
      <div>
        <Node tag="div" attrs={{ onClick: "SOME_ACTION" }}>
          <Node tag="div">
            Occaecat id elit reprehenderit deserunt veniam.
            <Node tag="div">
              Occaecat id elit reprehenderit deserunt veniam.
            </Node>
          </Node>
          <Node tag="div">Occaecat id elit reprehenderit deserunt veniam.</Node>
        </Node>
        <hr />
        <AceEditor
          mode="javascript"
          theme="github"
          onChange={onChange}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
        />
      </div>
    );
  }
}

export default CodeEditor;
