import NodeTree from "./NodeTreeOld";
import { values } from "lodash";

test("constructor", () => {
  const t = new NodeTree();
  expect(t.tree).toMatchObject({});
});

test("constructor fails with bad input", () => {
  expect(() => new NodeTree(true)).toThrow();
  expect(() => new NodeTree(false)).toThrow();
  expect(() => new NodeTree(5)).toThrow();
  expect(() => new NodeTree("Hello")).toThrow();
});

test("constructor with node", () => {
  const t = new NodeTree({
    label: "One"
  });
  expect(t.tree).toMatchObject({ label: "One", isSelected: false });
});

test("constructor with array of nodes", () => {
  expect(
    new NodeTree([
      {
        id: "node1",
        label: "One"
      },
      {
        id: "node2",
        label: "Two"
      }
    ]).tree
  ).toMatchObject({
    node1: {
      id: "node1",
      label: "One",
      isSelected: false
    },
    node2: {
      id: "node2",
      label: "Two",
      isSelected: false
    }
  });
});

test("add node", () => {
  let t = new NodeTree();
  t.addBelow({ id: null, node: { label: "Something" } });
  const keys = Object.keys(t.tree);
  expect(t.tree[keys[0]]).toMatchObject({ label: "Something" });
});

test("add a node at the end", () => {
  let t = new NodeTree();
  t.addBelow({ node: { label: "Something" } });
  t.addBelow({ node: { label: "Else" } });

  const firstId = Object.keys(t.tree)[0];
  const secondId = Object.keys(t.tree)[1];
  expect(t.tree).toMatchObject({
    [firstId]: { label: "Something" },
    [secondId]: { label: "Else" }
  });
});

test("add node after an id", () => {
  let t = new NodeTree([
    { label: "One", id: "node1" },
    { label: "Two", id: "node2" }
  ]);
  const firstId = Object.keys(t.tree)[0];
  t.addBelow({ id: firstId, node: { label: "OnePointFive", id: "node1_5" } });

  const secondId = Object.keys(t.tree)[1];
  expect(t.tree).toMatchObject({
    node1: { label: "One", id: "node1" },
    node1_5: { label: "OnePointFive", id: "node1_5" },
    node2: { label: "Two", id: "node2" }
  });
});

describe("select node between ids", () => {
  let t = new NodeTree([
    { label: "One", id: "node1" },
    { label: "Two", id: "node2" },
    { label: "Three", id: "node3" },
    { label: "Four", id: "node4" }
  ]);

  test("start and end id the same", () => {
    t.select({ fromId: "node2", toId: "node2" });
    expect(t.tree).toMatchObject({
      node1: { id: "node1", isSelected: false },
      node2: { id: "node2", isSelected: true },
      node3: { id: "node3", isSelected: false }
    });
  });

  test("start id smaller than end id", () => {
    t.select({ fromId: "node2", toId: "node3" });
    expect(t.tree).toMatchObject({
      node1: { id: "node1", isSelected: false },
      node2: { id: "node2", isSelected: true },
      node3: { id: "node3", isSelected: true },
      node4: { id: "node4", isSelected: false }
    });
  });

  test("start id larger than end id", () => {
    t.select({ fromId: "node3", toId: "node2" });
    expect(t.tree).toMatchObject({
      node1: { id: "node1", isSelected: false },
      node2: { id: "node2", isSelected: true },
      node3: { id: "node3", isSelected: true },
      node4: { id: "node4", isSelected: false }
    });
  });
});

test("deselect id", () => {
  let t = new NodeTree([{ label: "One", id: "node1" }]);
  expect(t.tree).toMatchObject({
    node1: { id: "node1", isSelected: false }
  });
  t.select({ fromId: "node1", toId: "node1" });
  expect(t.tree).toMatchObject({
    node1: { id: "node1", isSelected: true }
  });
  t.deselectAll();
  expect(t.tree).toMatchObject({
    node1: { id: "node1", isSelected: false }
  });
});

test("deselect ids", () => {
  let t = new NodeTree([
    { label: "One", id: "node1" },
    { label: "Two", id: "node2" }
  ]);
  expect(t.tree).toMatchObject({
    node1: { id: "node1", isSelected: false },
    node2: { id: "node2", isSelected: false }
  });
  t.select({ fromId: "node1", toId: "node2" });
  expect(t.tree).toMatchObject({
    node1: { id: "node1", isSelected: true },
    node2: { id: "node2", isSelected: true }
  });
  t.deselectAll();
  expect(t.tree).toMatchObject({
    node1: { id: "node1", isSelected: false },
    node2: { id: "node2", isSelected: false }
  });
});

test("remove selected", () => {
  let t = new NodeTree([
    { label: "One", id: "node1" },
    { label: "Two", id: "node2" },
    { label: "Three", id: "node3" },
    { label: "Four", id: "node4" }
  ]);
  t.select({ fromId: "node1", toId: "node2" });
  t.removeSelected();
  expect(t.tree).toMatchObject({
    node3: { id: "node3" },
    node4: { id: "node4" }
  });
});

test("remove selected", () => {
  let t = new NodeTree([
    { label: "One", id: "node1" },
    { label: "Two", id: "node2" },
    { label: "Three", id: "node3" },
    { label: "Four", id: "node4" }
  ]);
  t.select({ fromId: "node1", toId: "node2" });
  t.removeSelected();
  expect(t.tree).toMatchObject({
    node3: { id: "node3" },
    node4: { id: "node4" }
  });
});
