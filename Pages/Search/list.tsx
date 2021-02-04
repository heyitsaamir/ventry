import React from "react";
import { Item } from "../../Store/types";
import { FlatList } from "react-native-gesture-handler";
import { ItemCard } from "../../Components/ItemListCard";

interface Props {
  items: Item[];
  onItemTap: (item: Item) => void;
}

export const SearchList = ({ items, onItemTap }: Props) => {
  return (
    <FlatList
      data={items}
      renderItem={({ item }) => <ItemCard itemId={item.id} onTap={onItemTap} />}
      keyExtractor={(item) => item.id}
    />
  );
};
