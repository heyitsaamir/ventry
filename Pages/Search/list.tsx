import React from "react";
import { Item } from "../../Store/types";
import { View } from "react-native";
import { ListItem } from "react-native-elements";

interface Props {
  items: Item[];
  onTap: (item: Item) => void;
}

export const SearchList = ({ items, onTap }: Props) => {
  const ListItemRow = ({ item }: { item: Item }) => {
    let category: string;
    let amt: string;
    if (item.type === "Container") {
      category = "Contains: ";
      amt = `${item.itemsInside.length} items`;
    } else {
      category = "Quantity: ";
      amt = `${item.quantity}`;
    }

    return (
      <ListItem onPress={() => onTap(item)}>
        <ListItem.Content>
          <ListItem.Title>{item.name}</ListItem.Title>
          {item.upc && <ListItem.Subtitle>Upc: {item.upc}</ListItem.Subtitle>}
          <ListItem.Subtitle>
            {category}
            {amt}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    );
  };

  return (
    <>
      {items.map((item, index) => (
        <ListItemRow item={item} key={index} />
      ))}
    </>
  );
};
