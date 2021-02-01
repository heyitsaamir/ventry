import React from "react";
import { Item, State } from "../../Store/types";
import { useSelector } from "react-redux";
import { Text, ListItem } from "react-native-elements";
import ItemIcon from "../../Components/ItemIcon";

interface Props {
  itemId: string;
  onTap: (item: Item) => void;
}

export const ItemCard = ({ itemId, onTap }: Props) => {
  const item = useSelector<State, Item>((state) => state.inventory.present.items[itemId]);

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
    <ListItem bottomDivider onPress={() => onTap(item)}>
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
