import React, { Component } from "react";
import styled from "styled-components";
import { uniqueId, takeWhile, takeRightWhile } from "lodash";
import PlainContentEditable from "./PlainContentEditable";

const Box = styled.span`
  &:hover {
    background: #f8f8f8;
  }
  &:focus-within {
    background: #eee;
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
          marginLeft: `${this.props.indentLevel * 2}em`
        }}
      >
        <Dot />
        <PlainContentEditable
          innerRef={el => {
            this.el = el;
          }}
          className="no-focus-box"
          data-id={id}
          value={this.state.text}
          onChange={text => this.setState({ text })}
          onInput={e => {
            console.log(e.shiftKey && "SHIFT", e.key);
            e.key === "Backspace" &&
              !this.state.text &&
              this.props.remove(this.props.id);
            e.key === "ArrowUp" && this.props.cursorUp(this.props.id);
            e.key === "ArrowDown" && this.props.cursorDown(this.props.id);
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
    this.state = {
      nodes: [
        {
          id: uniqueId("node"),
          text: "Hello",
          indentLevel: 0
        },
        {
          id: uniqueId("node"),
          text: "There",
          indentLevel: 0
        }
      ]
    };
    this.ref = React.createRef();
  }
  indent = id => {
    const node = this.state.nodes.find(node => node.id === id);
    this.setState({
      nodes: [
        ...takeWhile(this.state.nodes, node => node.id !== id),
        {
          ...node,
          indentLevel: (node.indentLevel || 0) + 1
        },
        ...takeRightWhile(this.state.nodes, node => node.id !== id)
      ]
    });
  };
  unindent = id => {
    console.log("unindent");
    const node = this.state.nodes.find(node => node.id === id);
    this.setState({
      nodes: [
        ...takeWhile(this.state.nodes, node => node.id !== id),
        {
          ...node,
          indentLevel: Math.max(0, (node.indentLevel || 0) - 1)
        },
        ...takeRightWhile(this.state.nodes, node => node.id !== id)
      ]
    });
  };
  remove = id => {
    if (this.state.nodes.length === 0) return;
    const node = this.state.nodes.find(node => node.id === id);
    const index = this.state.nodes.indexOf(node);
    this.setState(
      {
        nodes: [
          ...takeWhile(this.state.nodes, node => node.id !== id),
          ...takeRightWhile(this.state.nodes, node => node.id !== id)
        ]
      },
      () => {
        console.log("remove index", index);
        const indexClipped = Math.max(
          Math.min(index - 1, this.state.nodes.length - 1),
          0
        );
        this.cursorTo(this.state.nodes[indexClipped].id, 0);
      }
    );
    // this.cursorTo(index, 0);
  };
  focus = id => {
    setTimeout(() => {
      const range = document.createRange();
      const sel = window.getSelection();
      range.setStart(this.ref.current.querySelector(`[data-id=${id}]`), 0);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }, 0);
  };
  cursorTo = (id, direction) => {
    console.log("cursor to");
    const node = this.state.nodes.find(node => node.id === id);
    const index = this.state.nodes.indexOf(node) + direction;
    const nextId = this.state.nodes[index].id;
    this.focus(nextId);
  };
  addNodeBelow = id => {
    const currentNode = this.state.nodes.find(node => node.id === id);
    const nextId = uniqueId("node");
    this.setState(
      {
        nodes: [
          ...takeWhile(this.state.nodes, node => node.id !== id),
          currentNode,
          {
            id: nextId,
            text: "",
            indentLevel: currentNode.indentLevel
          },
          ...takeRightWhile(this.state.nodes, node => node.id !== id)
        ]
      },
      () => this.focus(nextId)
    );
  };
  render() {
    return (
      <div ref={this.ref}>
        <b>Hello</b>
        {this.state.nodes.map(({ id, text, indentLevel }) => (
          <Bullet
            key={id}
            id={id}
            addNodeBelow={this.addNodeBelow}
            remove={this.remove}
            indent={this.indent}
            unindent={this.unindent}
            cursorUp={id => this.cursorTo(id, -1)}
            cursorDown={id => this.cursorTo(id, 1)}
            indentLevel={indentLevel}
          >
            {text}
          </Bullet>
        ))}
      </div>
    );
  }
}

export default BulletList;
