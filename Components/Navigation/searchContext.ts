import React from "react";
import { InventoryState } from "../../Store/inventory";
import { Item } from "../../Store/types";

export type OnItemTap = (item: Item) => void;
export type ItemPredicate = (inventory: InventoryState["items"]) => Item[];
export const SearchContext = React.createContext<{
  onItemTap: OnItemTap | undefined;
  setOnItemTap: (fn?: OnItemTap) => void;
  predicate: ItemPredicate | undefined;
  setPredicate?: (fn?: ItemPredicate) => void;
}>({
  onItemTap: undefined,
  setOnItemTap: (fn?: OnItemTap) => {},
  predicate: undefined,
  setPredicate: undefined,
});
