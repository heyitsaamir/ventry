import React, { useContext, useMemo } from "react";
import { FlatList, SafeAreaView, View } from "react-native";
import styled from "@emotion/native";
import { useSelector } from "react-redux";
import { Item, State } from "../../Store/types";
import { NavigatorProps, ScreenProps, useNav } from "../../Components/Navigation/Routes";
import { Icon, Text, ThemeContext } from "react-native-elements";
import ItemIcon from "../../Components/ItemIcon";
import { getNumberOfItemsInside, getParentPath } from "../../lib/modelUtilities/itemUtils";
import { ThemeProps } from "../../Components/Theme/types";
import InfoTag from "../../Components/InfoTag";
import useCustomNav, { RightNavButton } from "../../Components/Navigation/useCustonNav";
import { ItemCard } from "../../Components/ItemListCard";

interface Props extends ScreenProps<"ItemDetails"> {
  navigation: NavigatorProps<"ItemDetails">;
}

export const ItemDetailsScreen = ({ route }: Props) => {
  const item = useSelector<State, Item>((state) => state.inventory.present.items[route.params.itemId]);
  return item ? <ItemDetails item={item} /> : <Text>Does not exist</Text>;
};

const ItemDetails = ({ item }: { item: Item }) => {
  const parentPath = useSelector<State, string[]>((state) => {
    if (item) {
      return getParentPath(item, state.inventory.present);
    }
    return [];
  });
  const itemsInside = useSelector<State, number>((state) => {
    if (item && item.type === "Container") {
      return getNumberOfItemsInside(item, state.inventory.present);
    }
    return 0;
  });

  const nav = useNav();
  const { theme } = useContext(ThemeContext);
  const navButtons = useMemo(() => {
    const navButtons: RightNavButton[] = [];
    navButtons.push({
      name: "edit",
      type: "material",
      onPress: () => nav.navigate("EditItem", { itemId: item.id }),
    });
    if (item.type === "Container") {
      navButtons.push({
        name: "add",
        type: "material",
        onPress: () => nav.navigate("AddItem", { parentItemId: item.id }),
      });
    }
    return navButtons;
  }, [item]);
  useCustomNav({
    title: item.name,
    rightButtons: navButtons,
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={item.type === "Container" ? item.itemsInside : []}
        renderItem={({ item: itemId }) => (
          <ItemCard itemId={itemId} onTap={(item) => nav.push("ItemDetails", { itemId: item.id })} />
        )}
        keyExtractor={(itemId) => itemId}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <>
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
                {item.id !== "" && (
                  <ContainerPath theme={theme}>
                    <PathIcon type="octicon" name="chevron-right" size={12} />
                    {parentPath.join(" / ")}
                  </ContainerPath>
                )}
              </TitleContent>
            </TitleContainer>
            <InfoBar item={item} contains={itemsInside} />
          </>
        }
      />
    </SafeAreaView>
  );
};

const InfoBar = ({ item, contains }: { item: Item; contains?: number }) => {
  const { theme } = useContext(ThemeContext);
  if (item.type !== "Container") return null;
  return (
    <InfoBarContainer theme={theme}>
      <InfoTag info={`Types of items: ${item.itemsInside.length}`} />
      {contains != null ? <InfoTag info={`All items inside: ${contains}`} /> : null}
    </InfoBarContainer>
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

const ItemIconContainer = styled(ItemIcon)({ marginRight: 10 });

const ContainerPath = styled(Text)<ThemeProps>((props) => ({
  color: props.theme.colors.grey2,
}));

const InfoBarContainer = styled(View)<ThemeProps>((props) => ({
  backgroundColor: props.theme.colors.grey5,
  padding: 5,
  flexDirection: "row",
}));

const PathIcon = styled(Icon)({ marginRight: 5 });
