import React from "react";
import { Item } from "../../Store/types";

export type OnItemTap = (item: Item) => void;

export const SearchContext = React.createContext<{
  onItemTap?: OnItemTap;
  setOnItemTap: (fn?: OnItemTap) => void;
}>({
  onItemTap: undefined,
  setOnItemTap: (fn?: OnItemTap) => {},
});
