import React from "react";
import { View, ViewProps } from "react-native";
import { Card as UICard, Text } from "@ui-kitten/components";
import styled from "@emotion/native";
import { Item, State } from "../../Store/types";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useNav } from "../../Components/Navigation/Routes";

interface Props {
  itemId: string;
}

export const ItemCard = ({ itemId }: Props) => {
  const item = useSelector<State, Item>((state) => state.inventory.items[itemId]);
  const navigation = useNav();

  const Header = (props: ViewProps) => (
    <View {...props}>
      <Text category="h6">{item.name}</Text>
      <Text category="s1">Type: {item.type}</Text>
    </View>
  );

  return (
    <Card
      header={Header}
      status={item.type === "NonContainer" ? "info" : "warning"}
      onPress={item.type === "Container" ? () => navigation.push("ItemList", { itemId }) : undefined}
    >
      <Text>Amount {item.type === "NonContainer" ? item.quantity : item.itemsInside.length}</Text>
    </Card>
  );
};

const Card = styled(UICard)({
  width: "45%",
  marginVertical: 5,
});
