import { asList, asTreeNew } from "./NodeTree";

test("asList flat", () => {
  const list = asList({
    id1: {
      label: "Van",
      id: "id1"
    },
    id2: {
      label: "Too",
      id: "id2"
    }
  });
  expect(list).toMatchObject([
    {
      label: "Van",
      id: "id1"
    },
    {
      label: "Too",
      id: "id2"
    }
  ]);
});

describe("nested", () => {
  const tree = {
    id1: {
      label: "Van",
      id: "id1",
      tree: {
        id1_1: {
          label: "Van Van",
          id: "id1_1",
          tree: {}
        }
      }
    },
    id2: {
      label: "Too",
      id: "id2",
      tree: {
        id2_1: {
          label: "Too Van",
          id: "id2_1",
          tree: {
            id2_1_1: {
              label: "Too Van Van",
              id: "id2_1_1",
              tree: {}
            }
          }
        }
      }
    }
  };
  test("asList nested", () => {
    const list = asList(tree);
    expect(list).toHaveLength(5);
    expect(list).toMatchObject([
      {
        label: "Van",
        id: "id1",
        depth: 0
      },
      {
        label: "Van Van",
        id: "id1_1",
        depth: 1
      },
      {
        label: "Too",
        id: "id2",
        depth: 0
      },
      {
        label: "Too Van",
        id: "id2_1",
        depth: 1
      },
      {
        label: "Too Van Van",
        id: "id2_1_1",
        depth: 2
      }
    ]);
  });
  test("asList nested and back", () => {
    expect(asTreeNew(asList(tree))).toMatchObject(tree);
  });
});
