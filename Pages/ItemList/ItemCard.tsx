import React from "react";
import { Item, State } from "../../Store/types";
import { useSelector } from "react-redux";
import { useNav } from "../../Components/Navigation/Routes";
import { Text, ListItem } from "react-native-elements";
import ItemIcon from "../../Components/ItemIcon";

interface Props {
  itemId: string;
}

export const ItemCard = ({ itemId }: Props) => {
  const item = useSelector<State, Item>((state) => state.inventory.items[itemId]);
  const navigation = useNav();

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
    <ListItem onPress={() => navigation.push("ItemList", { itemId })}>
      <ItemIcon icon={item.icon} size="sm" isContainer={item.type === "Container"} />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>
          {category}
          {amt}
        </ListItem.Subtitle>
      </ListItem.Content>
      <Text>
        {category}
        {amt}
      </Text>

      {item.type === "Container" && <ListItem.Chevron />}
    </ListItem>
  );
};
