import React from "react";
import { Item, State } from "../../Store/types";
import { useSelector } from "react-redux";
import { Text, ListItem } from "react-native-elements";
import ItemIcon from "../../Components/ItemIcon";
import { IsContainer } from "../../lib/modelUtilities/itemUtils";

interface Props {
  itemId: string;
  onTap?: (item: Item) => void;
}

export const ItemListCard = ({ itemId, onTap }: Props) => {
  const item = useSelector<State, Item>((state) => state.inventory.present.items[itemId]);

  let category: string;
  let amt: string;
  if (IsContainer(item)) {
    category = "Contains: ";
    amt = `${item.itemsInside.length} items`;
  } else {
    category = "Quantity: ";
    amt = `${item.quantity}`;
  }

  return (
    <ListItem bottomDivider onPress={() => onTap && onTap(item)}>
      <ItemIcon icon={item.icon} size="sm" isContainer={IsContainer(item)} />
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

      {IsContainer(item) && <ListItem.Chevron />}
    </ListItem>
  );
};
