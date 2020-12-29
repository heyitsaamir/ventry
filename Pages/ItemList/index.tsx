import React from "react";
import { SafeAreaView, View } from "react-native";
import { Layout, Button, Text, Icon } from "@ui-kitten/components";
import styled from "@emotion/native";
import { ItemCard } from "./ItemCard";
import { useSelector } from "react-redux";
import { Item, State } from "../../Store/types";
import { NavigatorProps, ScreenProps, useNav } from "../../Components/Navigation/Routes";
import { ScrollView } from "react-native-gesture-handler";

interface Props extends ScreenProps<"ItemList"> {
  navigation: NavigatorProps<"ItemList">;
}

export const ItemList = ({ route }: Props) => {
  const item = useSelector<State, Item>((state) => state.inventory.items[route.params.itemId]);
  const nav = useNav();
  React.useLayoutEffect(() => {
    nav.setOptions({
      title: item.name,
      headerRight: () => (
        <Button
          onPress={() => nav.navigate("AddItem", { parentItemId: item.id })}
          appearance="ghost"
          accessoryLeft={(props) => <Icon name="plus" {...props} />}
        />
      ),
    });
  }, [nav]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1, alignItems: "center" }}>
        <ScrollView style={{ width: "100%" }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text category="h1">{item.name}</Text>
            {item.type === "Container" && item.itemsInside.length > 0 && (
              <CardContainer>
                {item.itemsInside.map((itemId, index) => (
                  <ItemCard key={index} itemId={itemId} />
                ))}
              </CardContainer>
            )}
          </View>
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};

const CardContainer = styled(View)({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-evenly",
});
