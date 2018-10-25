import {
  uniqueId,
  isArray,
  isObject,
  isUndefined,
  keyBy,
  takeWhile,
  takeRightWhile,
  values,
  last,
  minBy
} from "lodash";

const nodeDefaults = () => ({
  label: "",
  isCollapsed: false,
  isSelected: false,
  id: uniqueId("node"),
  indentLevel: 0,
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
  removeSelected() {
    this.selectionStartId = null;
    this.selectionEndId = null;
    this.isFromIndexHigher = true;
    const notTargetNode = node => !node.isSelected;
    const list = [
      ...takeWhile(values(this.tree), notTargetNode),
      ...takeRightWhile(values(this.tree), notTargetNode)
    ];
    this.tree = keyBy(list, "id");
  }
  // Adds bullet below or adds inside based on whether it already has some nodes indented
  addBelow(params) {
    this.deselectAll();
    const node = params.node || {};
    const keys = Object.keys(this.tree);
    const newNode = {
      ...nodeDefaults(),
      ...node,
      isSelected: true
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
    return newNode;
  }
  // expand(id) {}
  // collapse(id) {}
  // TODO: make this.isSelected(id) function instead?
  select({ fromId = this.selectionStartId, toId = this.selectionEndId }) {
    const indexRange = () => {
      const fromNode = this.tree[fromId];
      const toNode = this.tree[toId];
      const list = values(this.tree);
      const fromIndex = list.indexOf(fromNode);
      const toIndex = list.indexOf(toNode);
      const minIndex = Math.min(fromIndex, toIndex);
      const maxIndex = Math.max(fromIndex, toIndex);
      const isFromIndexHigher = fromIndex < toIndex;
      return { minIndex, maxIndex, isFromIndexHigher };
    };
    const { minIndex, maxIndex, isFromIndexHigher } = indexRange(fromId, toId);
    this.selectionStartId = fromId;
    this.selectionEndId = toId;
    this.isFromIndexHigher = isFromIndexHigher;
    values(this.tree).forEach((node, i) => {
      node.isSelected = i >= minIndex && i <= maxIndex;
    });
  }
  deselectAll() {
    this.selectionStartId = null;
    this.selectionEndId = null;
    this.isFromIndexHigher = true;
    values(this.tree).forEach((node, i) => {
      node.isSelected = false;
    });
  }
  getNodeAboveSelection() {
    const id = this.isFromIndexHigher
      ? this.selectionStartId
      : this.selectionEndId;
    return this.getNodeAbove(id);
  }
  getNodeBelowSelection() {
    const id = this.isFromIndexHigher
      ? this.selectionEndId
      : this.selectionStartId;
    return this.getNodeBelow(id);
  }
  indentSelected() {
    const list = values(this.tree);
    if (list[0].isSelected) return; // Don't indent first item
    const parentIndentLevel = this.getNodeAboveSelection().indentLevel;
    const minSelectedIndentLevel = minBy(
      list.filter(node => node.isSelected),
      node => node.indentLevel
    ).indentLevel;
    list.forEach((node, i) => {
      if (node.isSelected) {
        node.indentLevel =
          node.indentLevel - minSelectedIndentLevel + parentIndentLevel + 1;
      }
    });
  }
  unindentSelected() {
    values(this.tree).forEach((node, i) => {
      if (node.isSelected) {
        node.indentLevel = Math.max(0, node.indentLevel - 1);
      }
    });
  }
  getNodeAt(id) {
    return this.tree[id];
  }
  getFirstNode() {
    const list = values(this.tree);
    return list[0];
  }
  getNodeAbove(id) {
    const node = this.tree[id];
    const list = values(this.tree);
    const index = Math.max(list.indexOf(node) - 1, 0);
    return list[index];
  }
  getNodeBelow(id) {
    const node = this.tree[id];
    const list = values(this.tree);
    const index = Math.min(list.indexOf(node) + 1, list.length - 1);
    return list[index];
  }
}
