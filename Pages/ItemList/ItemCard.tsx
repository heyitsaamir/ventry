import React, { useContext } from "react";
import { Pressable, View, ViewProps } from "react-native";
import styled from "@emotion/native";
import { Item, State } from "../../Store/types";
import { useSelector } from "react-redux";
import { useNav } from "../../Components/Navigation/Routes";
import { Text, Card as UICard, ThemeContext, ListItem, Avatar } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
  itemId: string;
}

export const ItemCard = ({ itemId }: Props) => {
  const item = useSelector<State, Item>((state) => state.inventory.items[itemId]);
  const navigation = useNav();

  const Header = (props: ViewProps) => (
    <View {...props}>
      <Text>{item.name}</Text>
      <Text>Type: {item.type}</Text>
    </View>
  );

  const { theme } = useContext(ThemeContext);
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
    <ListItem onPress={item.type === "Container" ? () => navigation.push("ItemList", { itemId }) : undefined}>
      <Avatar
        rounded
        icon={{
          name: item.type === "Container" ? "box-open" : "lemon",
          type: "font-awesome-5",
          color: theme.colors.black,
        }}
        containerStyle={{ backgroundColor: theme.colors.grey5 }}
      />
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

const Card = styled(View)({
  marginVertical: 5,
  padding: 5,
  shadowRadius: 10,
  shadowOffset: {
    width: 3,
    height: 3,
  },
  shadowOpacity: 0.1,
});

const Title = styled(View)({
  flex: 1,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
});
