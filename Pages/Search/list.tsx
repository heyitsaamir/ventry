import React from "react";
import { Item } from "../../Store/types";
import { FlatList } from "react-native-gesture-handler";
import { ItemListCard } from "../../Components/ItemListCard";

interface Props {
  items: Item[];
  header?: React.ReactElement;
  onItemTap?: (item: Item) => void;
}

export const SearchList = ({ items, header, onItemTap }: Props) => {
  return (
    <FlatList
      data={items}
      ListHeaderComponent={header}
      renderItem={({ item }) => <ItemListCard itemId={item.id} onTap={onItemTap} />}
      keyExtractor={(item) => item.id}
    />
  );
};
