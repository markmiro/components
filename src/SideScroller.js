import React, { Component } from "react";
import styled from "styled-components";
import { easePolyOut } from "d3-ease";

// TODO: allow clicking arrows quickly

const Container = styled.div`
  position: relative;
`;

const ScrollBarHider = styled.div`
  overflow-y: hidden;
`;

const Window = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;
  padding-bottom: 14px;
  margin-bottom: -14px;
  position: relative;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
`;

const Arrow = styled.div`
  position: absolute;
  top: 50%;
  background: black;
  width: 2em;
  height: 2em;
  ${({ type }) =>
    type === "left" &&
    `
    left: 0;
    transform: translate(-50%, -50%);
  `} ${({ type }) =>
      type === "right" &&
      `
    right: 0;
    transform: translate(50%, -50%);
  `};
`;

const SideScrollerItem = styled.div`
  background-color: lightgray;
  width: ${({ width = "50%" }) => width};
  display: inline-block;
  padding: 50px;
  text-align: center;
  border-right: 10px solid black;
`;

class SideScroller extends Component {
  state = { scrollLeft: 0 };
  componentDidMount = () => {
    this.windowEl.addEventListener("scroll", this.handleScroll);
  };
  componentWillUnmount = () => {
    this.windowEl.removeEventListener("scroll", this.handleScroll);
  };
  handleScroll = e => {
    this.setState({ scrollLeft: e.target.scrollLeft });
    // console.log(e.target.scrollLeft);
  };
  getWidths() {
    let widths = [];
    let accWidths = 0;
    Array.from(this.windowEl.children).forEach(SideScrollerItem => {
      const width = SideScrollerItem.offsetWidth;
      widths.push({ width, scrollLeft: accWidths });
      accWidths += width;
    });
    return widths;
  }
  getMaxScrollPosition = () => {
    const totalWidth = Array.from(this.windowEl.children).reduce(
      (acc, curr) => acc + curr.offsetWidth,
      0
    );
    const windowWidth = this.windowEl.offsetWidth;
    return totalWidth - windowWidth;
  };
  scrollTo = targetPosition => {
    // this.windowEl.scrollLeft = targetPosition;
    let start = null;
    const startPosition = this.windowEl.scrollLeft;
    const distance = Math.abs(targetPosition - startPosition);
    const sign = Math.sign(targetPosition - startPosition);
    const _this = this;
    function step(timestamp) {
      const SPEED = 0.002;
      if (!start) start = timestamp;
      const progress = easePolyOut((timestamp - start) * SPEED, 3);
      const scrollLeft =
        startPosition + Math.min(progress, 1) * distance * sign;
      // console.log(Math.round(progress * 100) / 100, distance, scrollLeft);
      _this.windowEl.scrollLeft = scrollLeft;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }
    window.requestAnimationFrame(step);
  };
  goLeft = () => {
    // console.log(this.windowEl, this.windowEl.scrollLeft);
    const widths = this.getWidths();
    const targetItem = widths
      .reverse()
      .find(({ scrollLeft }) => scrollLeft < this.windowEl.scrollLeft);
    this.scrollTo(targetItem ? targetItem.scrollLeft : 0);
  };
  goRight = () => {
    // console.log(this.windowEl, this.windowEl.scrollLeft);
    const widths = this.getWidths();
    const targetItem = widths.find(
      ({ scrollLeft, width }) =>
        scrollLeft + width >
        this.windowEl.scrollLeft + this.windowEl.offsetWidth
    );
    this.scrollTo(
      targetItem
        ? targetItem.scrollLeft + targetItem.width - this.windowEl.offsetWidth
        : this.getMaxScrollPosition()
    );
  };
  isAtBeginning = () => {
    return this.state.scrollLeft === 0;
  };
  isAtEnd = () => {
    if (!this.windowEl) {
      this.forceUpdate();
      return;
    }
    console.log(this.state.scrollLeft, this.getMaxScrollPosition());
    return (
      Math.round(this.state.scrollLeft) ===
      Math.round(this.getMaxScrollPosition())
    );
  };
  render() {
    return (
      <Container>
        <ScrollBarHider>
          <Window innerRef={el => (this.windowEl = el)}>
            <SideScrollerItem width="150%">Item 1</SideScrollerItem>
            <SideScrollerItem>Item 2</SideScrollerItem>
            <SideScrollerItem width={300}>Item 3</SideScrollerItem>
            <SideScrollerItem>Item 4</SideScrollerItem>
            <SideScrollerItem width="120%">Item 5</SideScrollerItem>
            <SideScrollerItem width="33.33%">Item 6</SideScrollerItem>
            <SideScrollerItem width="33.33%">Item 7</SideScrollerItem>
            <SideScrollerItem width="33.33%">Item 8</SideScrollerItem>
          </Window>
        </ScrollBarHider>
        {!this.isAtBeginning() && <Arrow type="left" onClick={this.goLeft} />}
        {!this.isAtEnd() && <Arrow type="right" onClick={this.goRight} />}
      </Container>
    );
  }
}

export default SideScroller;
