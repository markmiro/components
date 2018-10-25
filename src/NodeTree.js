import {
  uniqueId,
  isArray,
  isObject,
  isUndefined,
  keyBy,
  takeWhile,
  takeRightWhile,
  values,
  last
} from "lodash";

const nodeDefaults = () => ({
  label: "",
  isCollapsed: false,
  isSelected: false,
  id: uniqueId("node"),
  children: {},
  extras: {}
});

/*
  This could be a reducer?
  May not want to store this in state because we may want to update nodes by hand based on this structure
  Process could be:
  - User does action
  - Action handled by this class or reducer thing (we want to store data in efficient way)
  - The relevant node is updated
*/
export default class NodeTree {
  constructor(nodeTree) {
    // Use a hashmap or something?
    this.selectStartId = null;
    this.selectEndId = null;
    if (isArray(nodeTree)) {
      const setDefaults = node => ({ ...nodeDefaults(), ...node });
      this.tree = keyBy(nodeTree.map(setDefaults), "id");
    } else if (isObject(nodeTree)) {
      this.tree = (nodeTree && { ...nodeDefaults(), ...nodeTree }) || {};
    } else if (isUndefined(nodeTree)) {
      this.tree = {};
    } else {
      throw new Error("Didn't expect `nodeTree` of type " + typeof nodeTree);
    }
    /*
    Node: {
      id
      label
      isCollapsed: false,
      isSelected (not sure if this is the best way, but might be good for now, this could be a function to have state in one place)
      extras (anything you wanna store, including the react class that we use to wrap the contenteditable stuff with)
    }
    */
  }
  // TODO: delete selection
  removeSelected() {
    const notTargetNode = node => !node.isSelected;
    const list = [
      ...takeWhile(values(this.tree), notTargetNode),
      ...takeRightWhile(values(this.tree), notTargetNode)
    ];
    this.tree = keyBy(list, "id");
  }
  // Adds bullet below or adds inside based on whether it already has some nodes indented
  addBelow(params) {
    const node = params.node;
    const keys = Object.keys(this.tree);
    const newNode = {
      ...nodeDefaults(),
      ...node
    };
    if (keys.length === 0) {
      this.tree[newNode.id] = newNode;
    } else {
      const id = params.id || last(values(this.tree)).id;
      const notTargetNode = node => node.id !== id;
      const list = [
        ...takeWhile(values(this.tree), notTargetNode),
        this.getNodeAt(id),
        newNode,
        ...takeRightWhile(values(this.tree), notTargetNode)
      ];
      console.info(list);
      this.tree = keyBy(list, "id");
    }
  }
  // expand(id) {}
  // collapse(id) {}
  select({ fromId, toId }) {
    const indexRange = () => {
      const fromNode = this.tree[fromId];
      const toNode = this.tree[toId];
      const list = values(this.tree);
      const fromIndex = list.indexOf(fromNode);
      const toIndex = list.indexOf(toNode);
      const minIndex = Math.min(fromIndex, toIndex);
      const maxIndex = Math.max(fromIndex, toIndex);
      return { minIndex, maxIndex };
    };
    const { minIndex, maxIndex } = indexRange(fromId, toId);
    values(this.tree).forEach((node, i) => {
      node.isSelected = i >= minIndex && i <= maxIndex;
    });
  }
  deselectAll() {
    values(this.tree).forEach((node, i) => {
      node.isSelected = false;
    });
  }
  indentSelected() {}
  unindentSelected() {}
  // getParentNode(id) {}
  getNodeAt(id) {
    return this.tree[id];
  }
  getNodeAbove(id) {}
  getNodeBelow(id) {}
}
