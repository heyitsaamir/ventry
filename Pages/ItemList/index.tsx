import React, { useContext } from "react";
import { SafeAreaView, View } from "react-native";
import styled from "@emotion/native";
import { ItemCard } from "./ItemCard";
import { useSelector } from "react-redux";
import { Item, State } from "../../Store/types";
import { NavigatorProps, ScreenProps, useNav } from "../../Components/Navigation/Routes";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Text, Icon, ThemeContext, Divider } from "react-native-elements";
import RightNavItemContainer from "../../Components/Navigation/RightNavItemContainer";
import ItemIcon from "../../Components/ItemIcon";

interface Props extends ScreenProps<"ItemList"> {
  navigation: NavigatorProps<"ItemList">;
}

export const ItemList = ({ route }: Props) => {
  const item = useSelector<State, Item>((state) => state.inventory.items[route.params.itemId]);
  const nav = useNav();
  const { theme } = useContext(ThemeContext);
  React.useLayoutEffect(() => {
    nav.setOptions({
      title: item.name,
      headerRight:
        item.type === "Container"
          ? () => (
              <RightNavItemContainer>
                <Icon
                  name="add"
                  type="material"
                  color={theme.colors.primary}
                  onPress={() => nav.navigate("AddItem", { parentItemId: item.id })}
                />
              </RightNavItemContainer>
            )
          : undefined,
    });
  }, [nav]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <TitleContainer style={{ backgroundColor: theme.colors.white }}>
            <ItemIconContainer size="md" isContainer={item.type === "Container"} icon={item.icon} />
            <TitleContent>
              <Text h3 style={{ fontWeight: "bold" }}>
                {item.name}
              </Text>
              <Text>
                {new Date(Date.parse(item.createdAtUTC)).toLocaleDateString("en-us", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
              <Text>Container Count</Text>
            </TitleContent>
          </TitleContainer>
          <Divider style={{ marginVertical: 1 }} />
          {item.type === "Container" && item.itemsInside.length > 0 && (
            <CardContainer>
              {item.itemsInside.map((itemId, index) => (
                <ItemCard key={index} itemId={itemId} />
              ))}
            </CardContainer>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const TitleContainer = styled(View)({
  display: "flex",
  flexDirection: "row",
  height: 100,
  width: "100%",
  padding: 10,
  justifyContent: "flex-start",
  alignItems: "center",
});

const TitleContent = styled(View)({});

const CardContainer = styled(View)({
  width: "100%",
  display: "flex",
  flex: 1,
});

const ItemIconContainer = styled(ItemIcon)({ marginRight: 10 });
