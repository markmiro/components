import React, { Component } from "react";
import styled from "styled-components";
import { uniqueId, takeWhile, takeRightWhile, values } from "lodash";
import PlainContentEditable from "./PlainContentEditable";
import NodeTree from "./NodeTree";

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

class Bullet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.children
    };
  }
  render() {
    const { id } = this.props;
    return (
      <Box
        title={this.props.id}
        style={{
          display: "flex",
          marginLeft: `${this.props.indentLevel * 2}em`,
          background: this.props.isSelected && "#0000ff11"
        }}
      >
        {this.props.isCollapsed ? "+" : "−"}
        <Dot />
        <PlainContentEditable
          innerRef={el => {
            this.el = el;
          }}
          className="no-focus-box"
          data-id={id}
          value={this.state.text}
          onChange={this.props.onChange}
          onInput={e => {
            console.log(e.shiftKey && "SHIFT", e.key);
            e.key === "Backspace" && !this.state.text && this.props.remove();
            e.key === "ArrowUp" && this.props.cursorUp();
            e.key === "ArrowDown" && this.props.cursorDown();
            if (e.shiftKey && e.key === "Tab") {
              this.props.unindent(this.props.id);
            } else if (e.key === "Tab") {
              this.props.indent(this.props.id);
            }
            e.key === "Enter" && this.props.addNodeBelow(this.props.id);
          }}
          style={{ width: "100%" }}
        />
      </Box>
    );
  }
}

class BulletList extends Component {
  constructor(props) {
    super(props);
    const nodeTree = JSON.parse(window.localStorage.getItem("nodeTree"));
    this.state = {
      nodes: new NodeTree(
        (nodeTree && values(nodeTree)) || [
          {
            label: "Type something"
          }
        ]
      )
    };
    this.ref = React.createRef();
  }
  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);
  }
  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp);
    window.localStorage.setItem(
      "nodeTree",
      JSON.stringify(this.state.nodes.tree)
    );
  }
  handleTextChange = (text, id) => {
    this.state.nodes.getNodeAt(id).label = text;
    this.forceUpdate();
  };
  handleMouseUp = e => {
    this.setState({ isMouseDown: false });
  };
  indent = id => {
    this.state.nodes.indentSelected();
    this.forceUpdate();
  };
  unindent = id => {
    this.state.nodes.unindentSelected();
    this.forceUpdate();
  };
  removeSelected = () => {
    const { nodes } = this.state;
    let id = nodes.getNodeAboveSelection().id;
    nodes.removeSelected();
    if (!nodes.getNodeAt(id)) id = nodes.getFirstNode().id;
    this.focus(id);
  };
  focus = id => {
    this.state.nodes.deselectAll();
    this.state.nodes.select({ fromId: id, toId: id });
    this.forceUpdate(() => {
      setTimeout(() => {
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(this.ref.current.querySelector(`[data-id=${id}]`), 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }, 0);
    });
  };
  cursorTo = direction => {
    const { nodes } = this.state;
    if (direction === "up") {
      this.focus(nodes.getNodeAboveSelection().id);
    } else if (direction === "down") {
      this.focus(nodes.getNodeBelowSelection().id);
    } else {
      throw new Error("Direction either not provided or invalid");
    }
  };
  addNodeBelow = id => {
    const newNode = this.state.nodes.addBelow({ id });
    this.focus(newNode.id);
  };
  render() {
    return (
      <div
        ref={this.ref}
        onMouseDown={e => {
          const id = document.elementFromPoint(e.clientX, e.clientY).dataset.id;
          this.state.nodes.select({ fromId: id, toId: id });
          this.setState({
            isMouseDown: true
          });
        }}
        onMouseMove={e => {
          if (this.state.isMouseDown) {
            const id = document.elementFromPoint(e.clientX, e.clientY).dataset
              .id;
            this.state.nodes.select({ toId: id });
            if (
              this.state.nodes.selectionStartId !==
              this.state.nodes.selectionEndId
            ) {
              window.getSelection().removeAllRanges();
            }
            this.forceUpdate();
          }
        }}
        onKeyUp={e => {
          if (
            e.key === "Backspace" &&
            this.state.nodes.selectionStartId !==
              this.state.nodes.selectionEndId
          ) {
            this.removeSelected();
          }
        }}
      >
        {values(this.state.nodes.tree).map(
          ({ id, label, isSelected, indentLevel }, i) => (
            <Bullet
              key={id}
              id={id}
              onChange={text => this.handleTextChange(text, id)}
              isSelected={isSelected}
              addNodeBelow={this.addNodeBelow}
              remove={this.removeSelected}
              indent={this.indent}
              unindent={this.unindent}
              cursorUp={() => this.cursorTo("up")}
              cursorDown={() => this.cursorTo("down")}
              indentLevel={indentLevel}
            >
              {label}
            </Bullet>
          )
        )}
      </div>
    );
  }
}

export default BulletList;
