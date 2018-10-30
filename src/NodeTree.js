import {
  keyBy,
  takeWhile,
  takeRightWhile,
  reject,
  values,
  first,
  last,
  isEmpty,
  flatMapDeep,
  get,
  omit,
  findIndex
} from "lodash";
import uuid from "uuid/v1";
import demoState from "./nodeTreeDemo";

// SETUP -----------

const nodeDefaults = () => ({
  label: "",
  isCollapsed: false,
  isSelected: false,
  id: uuid(),
  indentLevel: 0,
  extras: {},
  tree: {}
});

const defaultNode = nodeDefaults();
const defaultState = {
  selectionStartId: null,
  selectionEndId: null,
  isFromIndexHigher: true,
  tree: {
    [defaultNode.id]: {
      ...defaultNode,
      label: "Type something"
    }
  }
};

export const initialState = demoState || defaultState;

// REDUCER -----------

export function reducer(state, action) {
  console.log(action);
  switch (action.type) {
    case "SELECT":
      return select(state, {
        fromId: action.fromId,
        toId: action.toId
      });
    case "CURSOR_UP":
      const upId = treeFuncs.getNodeAboveId(state.tree, state.selectionStartId);
      return select(state, {
        fromId: upId,
        toId: upId
      });
    case "SHIFT_UP":
      const shiftUpId = treeFuncs.getNodeAboveId(
        state.tree,
        state.selectionStartId
      );
      return select(state, {
        fromId: shiftUpId
      });
    case "CURSOR_DOWN":
      const downId = treeFuncs.getNodeBelowId(state.tree, state.selectionEndId);
      return select(state, {
        fromId: downId,
        toId: downId
      });
    case "SHIFT_DOWN":
      const shiftDownId = treeFuncs.getNodeBelowId(
        state.tree,
        state.selectionEndId
      );
      return select(state, {
        toId: shiftDownId
      });
    case "CHANGE_LABEL":
      return {
        ...state,
        tree: treeFuncs.updateNodeAtId(state.tree, action.id, {
          label: action.label
        })
      };
    case "ADD_NODE_BELOW":
      const deselectedState = deselectAll(state);
      return {
        ...deselectedState,
        ...treeFuncs.addBelow(deselectedState.tree, action.id)
      };
    case "REMOVE_SELECTED":
      return removeSelected(state);
    default:
      return state;
  }
}

// TREE FUNCS -----------

// Fancy version of `values(tree);`
export function asList(tree, depth = 0) {
  return flatMapDeep(values(tree), node => {
    const nodeWithoutTree = {
      ...omit(node, "tree"),
      depth
    };
    return isEmpty(node.tree)
      ? nodeWithoutTree
      : [nodeWithoutTree, asList(node.tree, depth + 1)];
  });
}

// Fancy version of `keyBy(list, "id")`
export function asTree(list) {
  let tree = {};
  let currentPath = [];
  list.forEach(node => {
    const nodeWithTree = {
      ...omit(node, "depth"),
      tree: {}
    };
    if (node.depth === 0) {
      tree[node.id] = nodeWithTree;
    } else {
      get(tree, currentPath.join(".tree.")).tree[node.id] = nodeWithTree;
    }
    currentPath[node.depth] = node.id;
    currentPath = currentPath.slice(0, node.depth + 1);
  });
  console.info(tree);
  return tree;
}

export const treeFuncs = {
  // TODO: In BulletList we want the node that has the tree
  // TODO: maybe keep both tree and list representations in memory, or keep id to node (sorted map)
  getNode(tree, id) {
    return keyBy(asList(tree), "id")[id];
  },
  map(tree, func) {
    return asTree(asList(tree).map(func));
  },
  mapValues(tree, func) {
    return asList(tree).map(func);
  },
  updateNodeAtId(tree, id, nodeChanges) {
    return treeFuncs.map(tree, node => {
      if (node.id !== id) return node;
      return {
        ...node,
        ...nodeChanges
      };
    });
  },
  addBelow(tree, id) {
    const newNode = {
      ...nodeDefaults(),
      depth: 0,
      isSelected: true
    };
    const list = asList(tree);
    let newList = [];
    if (Object.keys(tree).length === 0) {
      newList = [newNode];
    } else {
      const idAbove = id || last(list).id;
      const notTargetNode = node => node.id !== idAbove;
      const nodeAbove = treeFuncs.getNode(tree, idAbove);
      newList = [
        ...takeWhile(list, notTargetNode),
        nodeAbove,
        { ...newNode, depth: nodeAbove.depth },
        ...takeRightWhile(list, notTargetNode)
      ];
      // console.info(newList);
    }
    return {
      tree: asTree(newList),
      selectionStartId: newNode.id,
      selectionEndId: newNode.id
    };
  },
  getNodeAboveId(tree, id) {
    const node = tree[id];
    const list = asList(tree);
    const index = Math.max(findIndex(list, n => n.id === node.id) - 1, 0);
    return list[index].id;
  },
  getNodeBelowId(tree, id) {
    const node = tree[id];
    const list = asList(tree);
    const index = Math.min(
      findIndex(list, n => n.id === node.id) + 1,
      list.length - 1
    );
    return list[index].id;
  },
  getFirstNodeId(tree) {
    return first(asList(tree)).id;
  },
  removeSelected(tree) {
    const list = reject(asList(tree), "isSelected");
    if (list.length === 0) {
      return defaultState.tree;
    }
    return asTree(list);
  }
};

// STATE FUNCS -----------

function select(state, newSelection) {
  const { fromId, toId } = {
    fromId: newSelection.fromId || state.selectionStartId,
    toId: newSelection.toId || state.selectionEndId
  };
  const list = asList(state.tree);
  const indexRange = () => {
    const fromNode = treeFuncs.getNode(state.tree, fromId);
    const toNode = treeFuncs.getNode(state.tree, toId);
    const fromIndex = findIndex(list, n => n.id === fromNode.id);
    const toIndex = findIndex(list, n => n.id === toNode.id);
    const minIndex = Math.min(fromIndex, toIndex);
    const maxIndex = Math.max(fromIndex, toIndex);
    const isFromIndexHigher = fromIndex <= toIndex;
    return { minIndex, maxIndex, isFromIndexHigher };
  };
  const { minIndex, maxIndex, isFromIndexHigher } = indexRange();
  return {
    ...state,
    selectionStartId: fromId,
    selectionEndId: toId,
    isFromIndexHigher: isFromIndexHigher,
    tree: asTree(
      list.map((node, i) => ({
        ...node,
        isSelected: i >= minIndex && i <= maxIndex
      }))
    )
  };
}

function removeSelected(state) {
  const newTree = treeFuncs.removeSelected(state.tree);

  function getSelectedIdAfterDeletion() {
    const nodeIdAboveSelection = treeFuncs.getNodeAboveId(
      state.tree,
      state.isFromIndexHigher ? state.selectionStartId : state.selectionEndId
    );
    const firstNodeId = treeFuncs.getFirstNodeId(state.tree);
    if (nodeIdAboveSelection === firstNodeId) {
      return treeFuncs.getFirstNodeId(newTree);
    }
    return nodeIdAboveSelection;
  }

  const newState = {
    ...state,
    tree: newTree
  };

  const id = getSelectedIdAfterDeletion();
  return select(newState, { fromId: id, toId: id });
}

function deselectAll(state) {
  return {
    ...state,
    selectionStartId: null,
    selectionEndId: null,
    isFromIndexHigher: true,
    tree: treeFuncs.map(state.tree, node => ({
      ...node,
      isSelected: false
    }))
  };
}
