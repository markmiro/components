import React from "react";
import { storiesOf } from "@storybook/react";
import {
  FlexToggle,
  Item,
  Titled,
  MarketingSizes,
  PageBody,
  P,
  Spacer
} from "./SmartComponents";
import { range } from "lodash";
import sizes from "../sizes";

function message(number) {
  return (
    <div style={{ whiteSpace: "nowrap" }}>
      The quick brown fox
      <br />
      jumped over the lazy dog
    </div>
  );
}

storiesOf("Smart Components", module)
  .add("Marketing Kitchen Sink", () => (
    <FlexToggle direction="vertical" style={{ minHeight: "100%" }}>
      <Item style={{ top: 0, position: "sticky" }} grow={false}>
        Bla
      </Item>
      <PageBody>
        <FlexToggle>
          <div>
            <MarketingSizes>
              <Titled value="Marketing Kitchen Sink" isUnderlined>
                <P>
                  Nisi magna in duis culpa commodo esse id adipisicing
                  adipisicing magna officia non. Non consequat magna ad ad sint
                  est. Deserunt nisi commodo elit magna velit. Labore nisi minim
                  enim eu velit ex consectetur magna est eiusmod ad eu id qui.
                  Nisi magna in duis culpa commodo esse id adipisicing
                  adipisicing magna officia non. Non consequat magna ad ad sint
                  est. Deserunt nisi commodo elit magna velit. Labore nisi minim
                  enim eu velit ex consectetur magna est eiusmod ad eu id qui.
                  Nisi magna in duis culpa commodo esse id adipisicing
                  adipisicing magna officia non. Non consequat magna ad ad sint
                  est. Deserunt nisi commodo elit magna velit. Labore nisi minim
                  enim eu velit ex consectetur magna est eiusmod ad eu id qui.
                </P>
                <P>
                  Nisi magna in duis culpa commodo esse id adipisicing
                  adipisicing magna officia non. Non consequat magna ad ad sint
                  est. Deserunt nisi commodo elit magna velit. Labore nisi minim
                  enim eu velit ex consectetur magna est eiusmod ad eu id qui.
                  Nisi magna in duis culpa commodo esse id adipisicing
                  adipisicing magna officia non. Non consequat magna ad ad sint
                  est. Deserunt nisi commodo elit magna velit. Labore nisi minim
                  enim eu velit ex consectetur magna est eiusmod ad eu id qui.
                </P>
                <P>
                  Nisi magna in duis culpa commodo esse id adipisicing
                  adipisicing magna officia non. Non consequat magna ad ad sint
                  est. Deserunt nisi commodo elit magna velit. Labore nisi minim
                  enim eu velit ex consectetur magna est eiusmod ad eu id qui.
                </P>
                <P>
                  Nisi magna in duis culpa commodo esse id adipisicing
                  adipisicing magna officia non. Non consequat magna ad ad sint
                  est. Deserunt nisi commodo elit magna velit. Labore nisi minim
                  enim eu velit ex consectetur magna est eiusmod ad eu id qui.
                  Nisi magna in duis culpa commodo esse id adipisicing
                  adipisicing magna officia non. Non consequat magna ad ad sint
                  est. Deserunt nisi commodo elit magna velit. Labore nisi minim
                  enim eu velit ex consectetur magna est eiusmod ad eu id qui.
                  Nisi magna in duis culpa commodo esse id adipisicing
                  adipisicing magna officia non. Non consequat magna ad ad sint
                  est. Deserunt nisi commodo elit magna velit. Labore nisi minim
                  enim eu velit ex consectetur magna est eiusmod ad eu id qui.
                </P>
              </Titled>
            </MarketingSizes>
          </div>
          <FlexToggle
            style={{
              flexGrow: 0,
              minWidth: sizes[11],
              padding: sizes[4],
              background: "#eee",
              alignSelf: "flex-start"
            }}
          >
            <a href="#">One</a>
            <a href="#">Two</a>
            <a href="#">Three</a>
          </FlexToggle>
        </FlexToggle>
      </PageBody>
    </FlexToggle>
  ))
  .add("FlexToggle", () => (
    <FlexToggle>
      <Item>A</Item>
      <Item>B</Item>
      <FlexToggle>
        <Item>A</Item>
        <Item>B</Item>
      </FlexToggle>
    </FlexToggle>
  ))
  .add("Spacer", () => (
    <FlexToggle direction="vertical">
      <Spacer>
        <Item>The</Item>
        <Spacer>
          <Item>Quick</Item>
          <Spacer>
            <Item>Brown</Item>
            <Spacer>
              <Item>Fox</Item>
              <Spacer>
                <Item>Jumped</Item>
                <Spacer>
                  <Item>Over</Item>
                  <Spacer>
                    <Item>The</Item>
                    <Spacer>
                      <Item>Lazy</Item>
                      <Spacer>
                        <Item>Dog</Item>
                        <Spacer>
                          <Item>!</Item>
                          <Spacer>
                            <Item>!</Item>
                            <Spacer>
                              <Item>!</Item>
                            </Spacer>
                          </Spacer>
                        </Spacer>
                      </Spacer>
                    </Spacer>
                  </Spacer>
                </Spacer>
              </Spacer>
            </Spacer>
          </Spacer>
        </Spacer>
      </Spacer>
    </FlexToggle>
  ))
  .add("Titled", () => (
    <div>
      <Titled value={message(1)} size={0} isUnderlined />
      <Titled value={message(2)} size={1} isUnderlined />
      <Titled value={message(3)} size={2} isUnderlined />
      <Titled value={message(4)} size={3} isUnderlined />
      <Titled value={message(5)} size={4} isUnderlined />
      <Titled value={message(6)} size={5} isUnderlined />
      <Titled value={message(1)}>
        <Titled value={message(2)}>
          <Titled value={message(3)}>
            <Titled value={message(4)}>
              <Titled value={message(5)}>
                <Titled value={message(6)}>
                  Aliquip exercitation tempor pariatur consequat duis. Cupidatat
                  est nisi dolore mollit cupidatat adipisicing voluptate cillum
                  dolor tempor. Adipisicing cupidatat veniam irure voluptate id
                  reprehenderit. Magna do non nostrud culpa dolore elit ea est.
                  Sit exercitation nostrud aute Lorem et adipisicing veniam
                  ipsum ullamco cupidatat dolore ad Lorem esse.
                </Titled>
              </Titled>
            </Titled>
          </Titled>
        </Titled>
      </Titled>
      <hr />
      <div style={{ fontSize: "2em" }}>
        {range(100, 1000, 100).map(fontWeight => (
          <p key={fontWeight} style={{ fontWeight }}>
            {fontWeight} The quick brown fox jumped over the lazy dog
          </p>
        ))}
      </div>
    </div>
  ));
