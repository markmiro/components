import React, { useContext } from "react";
import styled from "styled-components";
import sizes from "../sizes";

// TODO: direction code is very confusing. If parent is horizontal. Children have to check that the parent is vertical

const DirectionContext = React.createContext("vertical");
export const NestingContext = React.createContext(0);

export function MarketingSizes({ children }) {
  return (
    <NestingContext.Provider value={0}>{children}</NestingContext.Provider>
  );
}

export function AppSizes({ children }) {
  return (
    <NestingContext.Provider value={3}>{children}</NestingContext.Provider>
  );
}

export const PageBody = styled.div`
  padding-top: 5vw;
  padding-bottom: 5vw;
  padding-left: 1.5em;
  padding-right: 1.5em;
  max-width: 50em;
  margin-left: auto;
  margin-right: auto;
`;

export function P({ children }) {
  const nestingLevel = useContext(NestingContext);
  return (
    <p style={{ fontSize: sizes[nestingLevel + 4], marginBottom: ".75em" }}>
      {children}
    </p>
  );
}

export function Titled({ children, value, size, isUnderlined }) {
  const nestingLevel = useContext(NestingContext);
  const finalSize = size === undefined ? nestingLevel : size;
  const style = {
    borderBottom: isUnderlined ? "1px solid #d4d4d4" : null,
    paddingBottom: isUnderlined ? "0.25em" : null,
    lineHeight: 1,
    fontSize: sizes[9 - finalSize],
    fontWeight: finalSize % 2 === 0 ? 900 : 600,
    marginBottom: "0.5em"
  };
  return (
    <React.Fragment>
      {React.createElement("h" + (finalSize + 1), { style }, value)}
      <NestingContext.Provider value={finalSize + 1}>
        {children}
      </NestingContext.Provider>
    </React.Fragment>
  );
}

export function Item({ children, style, grow = true, ...rest }) {
  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #f9f9f9, #e0e0e0)",
        flexGrow: grow ? 1 : 0,
        padding: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...style
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Border({ type = "plain" }) {
  const direction = useContext(DirectionContext);
  switch (type) {
    case "shadow":
      return (
        <div
          style={{
            height: direction === "horizontal" ? 0 : "auto",
            width: direction === "vertical" ? 0 : "auto"
          }}
        >
          <div
            style={{
              background: `linear-gradient(to ${
                direction === "horizontal" ? "bottom" : "right"
              }, rgba(0, 0, 0, .5), transparent)`,
              position: "relative",
              height: direction === "horizontal" ? 10 : "100%",
              width: direction === "vertical" ? 10 : "100%"
            }}
          />
        </div>
      );
    case "plain":
    default:
      return (
        <div
          style={{
            background: "black",
            height: direction === "horizontal" ? 1 : "auto",
            width: direction === "vertical" ? 1 : "auto"
          }}
        />
      );
  }
}

// prettier-ignore
const SpaceWrapper = styled.div`
  display: flex;
  ${({ direction}) => direction === 'vertical' ? `flex-direction: row;` : null}
  ${({ direction}) => direction === 'horizontal' ? `flex-direction: column;` : null}
  & + & {
    ${({ direction, space}) => direction === 'vertical' ? `margin-left: ${space}px;` : null}
    ${({ direction, space}) => direction === 'horizontal' ? `margin-top: ${space}px;` : null}
  }
`;

export function Spacer({ children, size }) {
  const direction = useContext(DirectionContext);
  const nestingLevel = useContext(NestingContext);
  const finalSize = size !== undefined ? size : sizes[10 - nestingLevel];
  return React.Children.map(children, child => (
    <SpaceWrapper space={finalSize} direction={direction}>
      <NestingContext.Provider value={nestingLevel + 1}>
        {child}
      </NestingContext.Provider>
    </SpaceWrapper>
  ));
}

// toggles horizontal and vertical
export function FlexToggle({ children, direction, style }) {
  const sharedStyle = {
    display: "flex",
    flexGrow: 1,
    ...style
  };
  const nestingLevel = useContext(NestingContext);
  const wrappedChildren = (
    <NestingContext.Provider value={nestingLevel + 1}>
      {children}
    </NestingContext.Provider>
  );
  if (direction === "horizontal") {
    return (
      <div style={{ ...sharedStyle, flexDirection: "row" }}>
        <DirectionContext.Provider value="vertical">
          {wrappedChildren}
        </DirectionContext.Provider>
      </div>
    );
  } else if (direction === "vertical") {
    return (
      <div style={{ ...sharedStyle, flexDirection: "column" }}>
        <DirectionContext.Provider value="horizontal">
          {wrappedChildren}
        </DirectionContext.Provider>
      </div>
    );
  }
  return (
    <DirectionContext.Consumer>
      {direction => (
        <FlexToggle style={style} direction={direction}>
          {wrappedChildren}
        </FlexToggle>
      )}
    </DirectionContext.Consumer>
  );
}
