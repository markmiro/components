import React, { Component } from "react";
import styled from "styled-components";

const Resizer = styled.div`
  padding: 2em;
  outline: 1px solid gray;
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  &:after {
    content: "";
    width: 1em;
    height: 1em;
    bottom: 0;
    right: 0;
    position: absolute;
    background: gray;
  }
`;

export default class ResizerParent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: "100%",
      height: "100%"
    };
  }
  componentDidMount() {
    window.addEventListener("mousemove", e => {
      console.log(e);
      this.setState({
        width: e.clientX,
        height: e.clientY
      });
    });
  }
  render() {
    const { width, height } = this.state;
    return (
      <Resizer width={width} height={height}>
        {this.props.children}
      </Resizer>
    );
  }
}
