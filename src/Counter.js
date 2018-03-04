import React, { Component } from "react";
import { createStore } from "redux";
import styled from "styled-components";
import { Fill, PageCardCenter, Button, ButtonGroupH } from "./FormComponents";

const reducer = (state = 0, action) => {
  console.log(state, action);
  switch (action.type) {
    case "INCREMENT":
      debugger;
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
      break;
  }
};

const store = createStore(reducer);

const Count = styled.div`
  text-align: center;
  font-size: 3em;
  margin-bottom: 0.25em;
`;

class Counter extends Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }
  render() {
    return (
      <Fill>
        <PageCardCenter>
          <Count>{store.getState()}</Count>
          <ButtonGroupH>
            <Button onClick={() => store.dispatch({ type: "INCREMENT" })}>
              Increment
            </Button>
            <Button onClick={() => store.dispatch({ type: "DECREMENT" })}>
              Decrement
            </Button>
          </ButtonGroupH>
        </PageCardCenter>
      </Fill>
    );
  }
}

export default Counter;
