import {
  keyBy,
  takeWhile,
  takeRightWhile,
  reject,
  values,
  first,
  last
} from "lodash";
import uuid from "uuid/v1";

// SETUP -----------

const nodeDefaults = () => ({
  label: "",
  isCollapsed: false,
  isSelected: false,
  id: uuid(),
  indentLevel: 0,
  extras: {}
});

const defaultNode = nodeDefaults();
const defaultTree = {
  [defaultNode.id]: {
    ...defaultNode,
    label: "Type something"
  }
};
const localNodeTree = JSON.parse(window.localStorage.getItem("nodeTree"));
export const initialState = {
  selectionStartId: null,
  selectionEndId: null,
  isFromIndexHigher: true,
  tree: localNodeTree || defaultTree
};

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
      const upId = treeFuncs.getNodeAbove(state.tree, state.selectionStartId)
        .id;
      return select(state, {
        fromId: upId,
        toId: upId
      });
    case "SHIFT_UP":
      const shiftUpId = treeFuncs.getNodeAbove(
        state.tree,
        state.selectionStartId
      ).id;
      return select(state, {
        fromId: shiftUpId
      });
    case "CURSOR_DOWN":
      const downId = treeFuncs.getNodeBelow(state.tree, state.selectionEndId)
        .id;
      return select(state, {
        fromId: downId,
        toId: downId
      });
    case "SHIFT_DOWN":
      const shiftDownId = treeFuncs.getNodeBelow(
        state.tree,
        state.selectionEndId
      ).id;
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

export const treeFuncs = {
  getNode(tree, id) {
    return tree[id];
  },
  map(tree, func) {
    return keyBy(values(tree).map(func), "id");
  },
  mapValues(tree, func) {
    return values(tree).map(func);
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
      isSelected: true
    };
    const list = values(tree);
    if (Object.keys(tree).length === 0) {
      return {
        [newNode.id]: newNode
      };
    } else {
      const idAbove = id || last(list).id;
      const notTargetNode = node => node.id !== idAbove;
      const newList = [
        ...takeWhile(list, notTargetNode),
        treeFuncs.getNode(tree, idAbove),
        newNode,
        ...takeRightWhile(list, notTargetNode)
      ];
      console.info(newList);
      return {
        tree: keyBy(newList, "id"),
        selectionStartId: newNode.id,
        selectionEndId: newNode.id
      };
    }
  },
  getNodeAbove(tree, id) {
    const node = tree[id];
    const list = values(tree);
    const index = Math.max(list.indexOf(node) - 1, 0);
    return list[index];
  },
  getNodeBelow(tree, id) {
    const node = tree[id];
    const list = values(tree);
    const index = Math.min(list.indexOf(node) + 1, list.length - 1);
    return list[index];
  },
  getFirstNode(tree) {
    return first(values(tree));
  },
  removeSelected(tree) {
    const list = reject(values(tree), "isSelected");
    return keyBy(list, "id");
  }
};

// STATE FUNCS -----------

function select(state, newSelection) {
  const { fromId, toId } = {
    fromId: newSelection.fromId || state.selectionStartId,
    toId: newSelection.toId || state.selectionEndId
  };
  const indexRange = () => {
    const fromNode = treeFuncs.getNode(state.tree, fromId);
    const toNode = treeFuncs.getNode(state.tree, toId);
    const list = values(state.tree);
    const fromIndex = list.indexOf(fromNode);
    const toIndex = list.indexOf(toNode);
    const minIndex = Math.min(fromIndex, toIndex);
    const maxIndex = Math.max(fromIndex, toIndex);
    const isFromIndexHigher = fromIndex <= toIndex;
    return { minIndex, maxIndex, isFromIndexHigher };
  };
  const { minIndex, maxIndex, isFromIndexHigher } = indexRange(fromId, toId);
  return {
    ...state,
    selectionStartId: fromId,
    selectionEndId: toId,
    isFromIndexHigher: isFromIndexHigher,
    tree: treeFuncs.map(state.tree, (node, i) => ({
      ...node,
      isSelected: i >= minIndex && i <= maxIndex
    }))
  };
}

function removeSelected(state) {
  const newTree = treeFuncs.removeSelected(state.tree);

  function getSelectedIdAfterDeletion() {
    const nodeIdAboveSelection = treeFuncs.getNodeAbove(
      state.tree,
      state.isFromIndexHigher ? state.selectionStartId : state.selectionEndId
    ).id;
    const firstNodeId = treeFuncs.getFirstNode(state.tree).id;
    if (nodeIdAboveSelection === firstNodeId) {
      return treeFuncs.getFirstNode(newTree).id;
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
