import React, { Component } from "react";
import styled from "styled-components";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { uniqueId, omit } from "lodash";
import PlainContentEditable from "./PlainContentEditable";

const defaultState = [
  {
    id: uniqueId("node"),
    body: "This is a node",
    isExpanded: true
  },
  {
    id: uniqueId("node"),
    body: "This is a node",
    isExpanded: true,
    children: [
      {
        id: uniqueId("node"),
        body: "This is a node",
        isExpanded: true,
        children: [
          {
            id: uniqueId("node"),
            body: "This is a node",
            isExpanded: true
          }
        ]
      }
    ]
  }
];

let store = createStore((state = defaultState, action) => {
  switch (action.type) {
    case "UPDATE_TEST":
      return [
        ...state,
        { id: uniqueId("node"), body: "This is a node", isExpanded: true }
      ];
    case "EDIT_NODE":
      break;
    case "TOGGLE_NODE":
      break;
    case "ADD_NODE":
      break;
    default:
      return state;
  }
});

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
            value={this.state.text}
            onChange={text => this.setState({ text })}
          />
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
      <Node key={node.id} text={node.body}>
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
