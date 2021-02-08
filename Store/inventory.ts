import uuid from "react-native-uuid";
import { ActionCreatorWithPayload, createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import { Item, HistoryItem, ContainerItem, NonContainerItem, Summary } from "./types";
import { IsContainer } from "../lib/modelUtilities/itemUtils";

export interface InventoryState {
  items: { [id: string]: Item };
  historyItems: { [id: string]: HistoryItem };
  historyIdByItemId: { [itemId: string]: string[] };
}

type AddItemParams = {
  newItem:
  | Omit<ContainerItem, "id" | "createdAtUTC" | "itemsInside" | "parentId">
  | Omit<NonContainerItem, "id" | "createdAtUTC" | "parentId">;
  parentId: string;
};
type EditItemParams = {
  itemId: string;
  updatedItem:
  | Omit<ContainerItem, "id" | "createdAtUTC" | "itemsInside">
  | Omit<NonContainerItem, "id" | "createdAtUTC">;
};
type DeleteItemParams = { itemId: string; includeContents?: boolean };
type ChangeInQuantity = { itemId: string; type: "addOne" | "removeOne" };

export type ActionTypes = {
  AddItemParams: AddItemParams;
  EditItemParams: EditItemParams;
  DeleteItemParams: DeleteItemParams;
};

const initialState: InventoryState = {
  items: {
    "": {
      type: "Container",
      id: "",
      createdAtUTC: new Date().toUTCString(),
      name: "Root",
      parentId: "x",
      itemsInside: ["kitchen-id"],
    },
    "kitchen-id": {
      type: "Container",
      id: "kitchen-id",
      createdAtUTC: new Date().toUTCString(),
      name: "Kitchen",
      parentId: "",
      itemsInside: ["knives-id", "spoons-id"],
    },
    "knives-id": {
      type: "NonContainer",
      id: "knives-id",
      createdAtUTC: new Date().toUTCString(),
      name: "Knives",
      parentId: "kitchen-id",
      quantity: 4,
    },
    "spoons-id": {
      type: "NonContainer",
      id: "spoons-id",
      createdAtUTC: new Date().toUTCString(),
      name: "Spoons",
      parentId: "kitchen-id",
      quantity: 4,
    },
  },
  historyItems: {},
  historyIdByItemId: {},
};

export const inventorySlice = createSlice<InventoryState, SliceCaseReducers<InventoryState>>({
  name: "inventory",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<AddItemParams>) => {
      let itemToAdd: Item;
      const { parentId, newItem } = action.payload;
      if (newItem.type === "Container") {
        const containerItem = newItem;
        itemToAdd = {
          ...containerItem,
          parentId,
          id: uuid.v4(),
          createdAtUTC: new Date().toUTCString(),
          itemsInside: [],
        };
      } else if (newItem.type === "NonContainer") {
        const nonContainerItem = newItem;
        itemToAdd = {
          ...nonContainerItem,
          parentId,
          id: uuid.v4(),
          createdAtUTC: new Date().toUTCString(),
        };
      }
      const parent = state.items[action.payload.parentId];
      if (parent.type !== "Container") throw new Error("The parent id is not a container!");
      parent.itemsInside = parent.itemsInside.concat(itemToAdd.id);
      state.items[itemToAdd.id] = itemToAdd;

      addHistoryItem(state, itemToAdd.id, [`Created under ${parent.name}`]);
    },
    editItem: (state, action: PayloadAction<EditItemParams>) => {
      const { itemId, updatedItem } = action.payload;
      const originalItem = state.items[itemId];
      if (!originalItem) {
        throw new Error(`Original item did not exist: ${itemId}`);
      }
      // Special case for root container
      // Only allow changing the name or icon
      if (itemId === "") {
        state.items[""] = {
          ...state.items[""],
          name: updatedItem.name,
          icon: updatedItem.icon,
        };
        const differences = evaluateSimpleDifferenceInObject(originalItem, state.items[""]);
        addHistoryItem(state, itemId, differences);
        return;
      }

      if (
        updatedItem.type === "NonContainer" &&
        originalItem.type === "Container" &&
        originalItem.itemsInside.length > 0
      ) {
        throw new Error("Container is not empty. Cannot convert to item");
      }
      if (
        updatedItem.type === "Container" &&
        originalItem.type === "NonContainer" &&
        originalItem.quantity > 1
      ) {
        throw new Error("There is more than 1 item. Try convering one to a container");
      }
      const differences = evaluateSimpleDifferenceInObject(originalItem, updatedItem as Item);
      if (originalItem.parentId !== updatedItem.parentId) {
        // update parent
        const originalParent = state.items[originalItem.parentId] as ContainerItem;
        originalParent.itemsInside = originalParent.itemsInside.filter(
          (itemIdInside) => itemIdInside !== itemId
        );
        const newParent = state.items[updatedItem.parentId] as ContainerItem;
        newParent.itemsInside.push(itemId);
        differences.push(`Moved from ${originalParent.name} to ${newParent.name}`);
      }
      if (updatedItem.type === "Container") {
        state.items[itemId] = {
          ...originalItem,
          ...updatedItem,
          id: itemId,
          itemsInside: originalItem.type === "Container" ? originalItem.itemsInside : [],
        };
      } else {
        state.items[itemId] = {
          ...originalItem,
          ...updatedItem,
          id: itemId,
        };
      }

      addHistoryItem(state, itemId, differences);
    },
    deleteItem: (state, action: PayloadAction<DeleteItemParams>) => {
      deleteItemRecursive(state, action.payload);
    },
    changeInQuantity: (state, action: PayloadAction<ChangeInQuantity>) => {
      const { itemId, type } = action.payload;
      const originalItem = state.items[itemId];
      if (!originalItem) {
        throw new Error(`Original item did not exist: ${itemId}`);
      }
      if (IsContainer(originalItem)) {
        throw new Error(`Original item cannot be a ${originalItem.id}`);
      }
      state.items[itemId] = {
        ...originalItem,
        quantity: originalItem.quantity + (type === "addOne" ? 1 : -1),
      };
      const differences = evaluateSimpleDifferenceInObject(originalItem, state.items[itemId]);
      addHistoryItem(state, itemId, differences);
    },
  },
});

const {
  addItem: addItemFn,
  editItem: editItemFn,
  deleteItem: deleteItemFn,
  changeInQuantity: changeInQuantityFn,
} = inventorySlice.actions;

export default inventorySlice.reducer;
export const addItem: ActionCreatorWithPayload<AddItemParams> = addItemFn;
export const editItem: ActionCreatorWithPayload<EditItemParams> = editItemFn;
export const deleteItem: ActionCreatorWithPayload<DeleteItemParams> = deleteItemFn;
export const changeInQuantity: ActionCreatorWithPayload<ChangeInQuantity> = changeInQuantityFn;

const deleteItemRecursive = (state: InventoryState, payload: DeleteItemParams) => {
  const { itemId, includeContents = false } = payload;
  if (itemId === "") return; // Cannot delete root

  const item = state.items[itemId];
  if (!itemId) {
    throw new Error(`Item ${itemId} does not exist`);
  }
  if (item.type === "Container" && item.itemsInside.length > 0 && !includeContents) {
    throw new Error(`Item ${itemId} has things inside so it cannot be deleted without emptying it`);
  }
  const parent = state.items[item.parentId] as ContainerItem;
  parent.itemsInside = parent.itemsInside.filter((itemIdInside) => itemIdInside !== itemId);

  if (item.type === "Container") {
    // delete all its items inside first
    for (let i = 0; i < item.itemsInside.length; i++) {
      deleteItemRecursive(state, { itemId: item.itemsInside[i], includeContents });
    }
  }

  const historyItemIds = state.historyIdByItemId[itemId];
  historyItemIds.forEach((id) => delete state.historyItems[id]);
  delete state.historyIdByItemId[itemId];

  delete state.items[itemId];
};

const addHistoryItemIfNeeded = (state: InventoryState, itemId: string) => {
  if (state.historyIdByItemId[itemId] == null) {
    state.historyIdByItemId[itemId] = [];
  }
};

const addHistoryItem = (state: InventoryState, itemId: string, summary: Summary[]) => {
  addHistoryItemIfNeeded(state, itemId);
  if (summary.length === 1 && state.historyIdByItemId[itemId].length > 0) {
    const [firstSummary] = summary;
    const lastHistoryId = state.historyIdByItemId[itemId][state.historyIdByItemId[itemId].length - 1];
    const lastHistoryItem = state.historyItems[lastHistoryId];
    const [firstSummaryOfLastHistoryItem] = lastHistoryItem.summary;
    if (
      typeof firstSummary !== "string" &&
      typeof firstSummaryOfLastHistoryItem !== "string" &&
      firstSummary.type === "quantity" &&
      firstSummaryOfLastHistoryItem.type === "quantity" &&
      new Date().getTime() - new Date(lastHistoryItem.createdAtUTC).getTime() < 300_000
    ) {
      state.historyItems[lastHistoryId].summary = [
        {
          ...firstSummaryOfLastHistoryItem,
          endQuantity: firstSummary.endQuantity,
        },
      ];
      state.historyItems[lastHistoryId].createdAtUTC = new Date().toUTCString();
      return;
    }
  }
  const history: HistoryItem = {
    id: uuid.v4(),
    itemId,
    summary,
    createdAtUTC: new Date().toUTCString(),
  };
  state.historyItems[history.id] = history;
  state.historyIdByItemId[itemId].push(history.id);
};

type KeysOfItem = keyof ContainerItem | keyof NonContainerItem;
const keysToCheck: KeysOfItem[] = ["name", "type", "upc", "quantity", "icon"];
const evaluateSimpleDifferenceInObject = (originalItem: Item, newItem: Item): Summary[] => {
  const differences = Array.from(new Set(Object.keys(originalItem).concat(Object.keys(newItem)))).reduce(
    (differences, key: keyof ContainerItem | keyof NonContainerItem) => {
      if (keysToCheck.includes(key) && originalItem[key] !== newItem[key]) {
        if (!!originalItem[key] && !!newItem[key]) {
          differences.push({ summary: `Changed ${key} from ${originalItem[key]} to ${newItem[key]}`, key });
        } else if (!!originalItem[key]) {
          differences.push({ summary: `Removed ${key} from ${originalItem[key]} to ${newItem[key]}`, key });
        } else if (!!newItem[key]) {
          differences.push({ summary: `Changed ${key} to ${newItem[key]}`, key });
        }
      }
      return differences;
    },
    [] as { summary: string; key: KeysOfItem }[]
  );

  if (
    differences.length === 1 &&
    !IsContainer(originalItem) &&
    !IsContainer(newItem) &&
    differences[0].key === "quantity"
  ) {
    return [
      {
        type: "quantity",
        startQuantity: originalItem.quantity,
        endQuantity: newItem.quantity,
      },
    ];
  }

  return differences.map((diff) => diff.summary);
};
