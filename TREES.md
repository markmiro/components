Data structure (doubly linked list)
Lookup table of id to item
So inserts and deletions are cheap

Constraints:
* Don't touch or re-render React components that shouldn't be
* Avoid O(n) operations
* Avoid converting data structures
* Be functional?

-----

SEARCH: term

CHANGE_LABEL: id, newLabel

ADD_NODE_BELOW_SELECTED: id

CURSOR_UP: id

CURSOR_DOWN: id

SELECT: id

COLLAPSE: id

EXPAND: id

ZOOM_TO: id
* get children by looking for indent level greater than that of id. Stop once you hit same indent level
* maybe use something like a skip list for when there's a long list to comb through?
SHIFT_DOWN: (start and end id)
* First select node content (if ibeam is at beginning of node)
* Then select node with children
* Then select next node with children
SHIFT_UP: (start and end id)
* First select node content (if ibeam at end of node)
* Then select node
* Then select node above
* Then if node above is the parent (indent level is lower) then select the whole parent and children
REMOVE_SELECTED: (start and end id)
* Remove selected nodes
* Move cursor
INDENT_SELECTED (start and end id)

UNINDENT_SELECTED (start and end id)

{
  mapIdToNode: {
    id1: { isCollapsed: false, treeNode: <tree node> },
    id2: { isCollapsed: false, treeNode: <tree node> },
    ...
  },
  mapIdToContents: {
    id1: { label: 'Hello' },
    id2: { label: 'There' },
    ...
  },
  // Linked Tree is a list of doubly linked items. Plus, each sub arr also links to parent (for showing breadcrumbs)
  tree: LinkedTree([
    'id1',
    'id2',
    ['id3', 'id4', ['id5']], // children of id2
    'id6'
  ]),
  selectionStartId: 'id3',
  selectionEndId: 'id4',
  zoomedToId: 'id2',
}