import React, { Component } from "react";
import styled from "styled-components";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { uniqueId, omit } from "lodash";
import PlainContentEditable from "./PlainContentEditable";
import { Button, ButtonGroupH } from "./FormComponents";

const NodeElement = styled.div`
  display: flex;
`;

const ExpandCollapse = styled.span`
  display: block;
  display: inline-block;
  height: 1.2em;
  width: 1.2em;
  border-radius: 50%;
  line-height: 1.2em;
  text-align: center;
  flex-shrink: 0;
  margin-right: 0.3em;
  cursor: pointer;
  user-select: none;
  font-weight: bold;
  background: #ddd;
  ${({ isVisible }) => (isVisible ? undefined : "opacity: 0")};
`;

const Dot = styled.span`
  &:after {
    content: "•";
    margin-right: 0.3em;
  }
`;

const createNode = (body = "") => ({
  id: uniqueId("node"),
  body: body,
  isExpanded: false
});

const defaultState = [
  {
    id: uniqueId("node"),
    body: "This is a node 1",
    isExpanded: true
  },
  {
    id: uniqueId("node"),
    body: "This is a node 2",
    isExpanded: true,
    children: [
      {
        id: uniqueId("node"),
        body: "This is a node 2b",
        isExpanded: true,
        children: [
          {
            id: uniqueId("node"),
            body: "This is a node 2b1",
            isExpanded: true
          }
        ]
      }
    ]
  }
];

let store = createStore((state = defaultState, action) => {
  switch (action.type) {
    case "ADD_NODE_BELOW":
      state.forEach((node, i) => {
        if (node.id === action.id) {
          state = [
            ...state.slice(0, i + 1),
            createNode(),
            ...state.slice(i + 1)
          ];
        }
      });
      return state;
    case "REMOVE_NODE":
      state.forEach((node, i) => {
        if (node.id === action.id) {
          state = [...state.slice(0, i), ...state.slice(i + 1)];
        }
      });
      return state;
    default:
      return state;
  }
});

export class Node extends Component {
  constructor(props) {
    super(props);
    this.state = { downKeys: [], isExpanded: false, text: this.props.text };
  }
  toggleExpanded = () =>
    this.setState(state => ({
      isExpanded: !state.isExpanded
    }));
  render() {
    const hasChildren = React.Children.count(this.props.children) > 0;
    return (
      <NodeElement>
        <ExpandCollapse onClick={this.toggleExpanded} isVisible={hasChildren}>
          {this.state.isExpanded ? "−" : "+"}
        </ExpandCollapse>
        <Dot />
        <div style={{ width: "100%" }}>
          <PlainContentEditable
            className="no-focus-box"
            value={this.state.text}
            onChange={text => this.setState({ text })}
          />
          <ButtonGroupH>
            <Button
              size="s"
              onClick={() =>
                store.dispatch({
                  type: "ADD_NODE_BELOW",
                  id: this.props.id
                })
              }
            >
              Add
            </Button>
            <Button
              size="s"
              onClick={() =>
                store.dispatch({
                  type: "REMOVE_NODE",
                  id: this.props.id
                })
              }
            >
              Remove
            </Button>
          </ButtonGroupH>
          {this.state.isExpanded && this.props.children}
        </div>
      </NodeElement>
    );
  }
}

export class Tree extends Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }
  render() {
    const componentFromNode = node => (
      <Node key={node.id} id={node.id} text={node.body}>
        {node.children && node.children.map(componentFromNode)}
      </Node>
    );
    const nodes = store.getState().map(componentFromNode);
    return (
      <div>
        {nodes}
        <pre>{JSON.stringify(store.getState(), null, "  ")}</pre>
      </div>
    );
  }
}
