import React from "react";
import { Divider, Input, List, ListItem, Text, TextProps } from "@ui-kitten/components";
import { Item } from "../../Store/types";
import { View } from "react-native";

interface Props {
  items: Item[];
  onTap: (item: Item) => void;
}

export const SearchList = ({ items, onTap }: Props) => {
  const ListItemRow = ({ item }: { item: Item; index: number }) => {
    const ListDescriptor = (props: TextProps) => {
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
        <>
          <Text style={{ marginVertical: 2 }} {...props}>
            <Text appearance="hint" category="label">
              {category}
            </Text>
            <Text category="c1">{amt}</Text>
          </Text>
          {item.upc && (
            <Text style={{ marginVertical: 2 }} {...props}>
              <Text appearance="hint" category="c2">
                UPC:{" "}
              </Text>
              <Text category="c1">{item.upc}</Text>
            </Text>
          )}
        </>
      );
    };

    const Title = (props: TextProps) => {
      const { category, ...restProps } = props;
      return (
        <Text {...restProps} category="h1">
          {item.name}
        </Text>
      );
    };
    return <ListItem onPress={() => onTap(item)} title={Title} description={ListDescriptor} />;
  };

  return (
    <List style={{ width: "100%" }} data={items} ItemSeparatorComponent={Divider} renderItem={ListItemRow} />
  );
};
