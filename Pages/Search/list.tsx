import React from "react";
import { Item } from "../../Store/types";
import { FlatList } from "react-native-gesture-handler";
import { ItemCard } from "../../Components/ItemListCard";

interface Props {
  items: Item[];
  onTap: (item: Item) => void;
}

export const SearchList = ({ items, onTap }: Props) => {
  return (
    <FlatList
      data={items}
      renderItem={({ item }) => <ItemCard itemId={item.id} onTap={onTap} />}
      keyExtractor={(item) => item.id}
    />
  );
};
