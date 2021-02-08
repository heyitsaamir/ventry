import { StateWithHistory as UndoableState } from "redux-undo";

type Id = string;

interface BaseItem {
  id: Id;
  name: string;
  createdAtUTC: string;
  upc?: string;
  icon?: string;
  parentId: string;
}

interface NonContainerItem extends BaseItem {
  type: "NonContainer";
  quantity: number;
}

interface ContainerItem extends BaseItem {
  type: "Container";
  itemsInside: Id[];
}

type Item = NonContainerItem | ContainerItem;

interface InventoryState {
  items: { [id: string]: Item };
}

export interface V0State {
  inventory: UndoableState<InventoryState>;
}

export const v0Migration = (state?: {} & { _persist: any }): V0State & { _persist: any } => {
  return {
    ...state,
    inventory: {
      past: [],
      present: {
        items: {
          "": {
            type: "Container",
            id: "",
            createdAtUTC: new Date().toUTCString(),
            name: "Root",
            parentId: "x",
            itemsInside: [],
          },
        },
      },
      future: [],
    },
  };
};
