import React, { useCallback, useContext, useMemo } from "react";
import { Animated, SafeAreaView, View } from "react-native";
import styled from "@emotion/native";
import { useDispatch, useSelector } from "react-redux";
import { Item, State } from "../../Store/types";
import { NavigatorProps, ScreenProps, useNav } from "../../Components/Navigation/Routes";
import { Card, Icon, Text, Theme, ThemeContext } from "react-native-elements";
import ItemIcon from "../../Components/ItemIcon";
import { getNumberOfItemsInside, getParentPath, IsContainer } from "../../lib/modelUtilities/itemUtils";
import { ThemeProps } from "../../Components/Theme/types";
import InfoTag from "../../Components/InfoTag";
import useCustomNav, { RightNavButton } from "../../Components/Navigation/useCustonNav";
import { ItemListCard } from "../../Components/ItemListCard";
import { SceneMap } from "react-native-tab-view";
import { CollapsibleTabView, useCollapsibleScene } from "react-native-collapsible-tab-view";
import { HistoryItemCard } from "../../Components/ItemListCard/historyItem";
import dateFormat from "dateformat";
import { EmptyBasic } from "../../Components/Empty/EmptyBasic";
import { useAppDispatch } from "../../Store";
import { changeInQuantity, editItem } from "../../Store/inventory";
import { ScrollView } from "react-native-gesture-handler";
import { ItemCard } from "./Card";

type Route = {
  key: "first" | "second";
  title: string;
};

interface Props extends ScreenProps<"ItemDetails"> {
  navigation: NavigatorProps<"ItemDetails">;
}

export const ItemDetailsScreen = ({ route }: Props) => {
  const itemId = route.params.itemId;
  const item = useSelector<State, Item>((state) => state.inventory.present.items[itemId]);
  const [index, setIndex] = React.useState(0);
  const nav = useNav();
  const { theme } = useContext(ThemeContext);
  const dispatch = useAppDispatch();
  const navButtons = useMemo(() => {
    if (!item) return [];
    const navButtons: RightNavButton[] = [];
    navButtons.push({
      name: "edit",
      type: "material",
      onPress: () => nav.navigate("EditItem", { itemId: item.id }),
    });
    return navButtons;
  }, [item]);
  useCustomNav({
    title: item.name,
    rightButtons: navButtons,
  });

  const onCreateNewItem = useCallback(() => {
    if (IsContainer(item)) {
      nav.navigate("AddItem", { parentItemId: item.id });
    }
  }, [nav, item]);

  const increaseInQuantity = useCallback(() => {
    if (!IsContainer(item)) {
      dispatch(changeInQuantity({ itemId: item.id, type: "addOne" }));
    }
  }, [dispatch, item]);
  const removeInQuantity = useCallback(() => {
    if (!IsContainer(item)) {
      dispatch(changeInQuantity({ itemId: item.id, type: "removeOne" }));
    }
  }, [dispatch, item]);

  const { sceneMap, routes } = useMemo(() => {
    const ItemDetailsScene = () => <ItemDetails itemId={itemId} navigation={nav} />;
    const ItemHistoryScene = () => <ItemHistory itemId={itemId} navigation={nav} />;
    return {
      sceneMap: SceneMap({
        first: ItemDetailsScene,
        second: ItemHistoryScene,
      }),
      routes: [
        { key: "first", title: "Details" },
        { key: "second", title: "History" },
      ] as Route[],
    };
  }, [itemId, nav, item.type]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {item ? (
        <CollapsibleTabView<Route>
          navigationState={{ index, routes }}
          renderScene={sceneMap}
          onIndexChange={setIndex}
          renderHeader={() => <ItemHeader item={item} theme={theme} />} // optional
          headerHeight={145}
          tabBarProps={{
            tabStyle: { backgroundColor: theme.colors.primary },
            pressOpacity: 0.8,
            pressColor: theme.colors.primary,
          }}
        />
      ) : (
        <Text>Does not exist</Text>
      )}
      <FabContainer>
        {IsContainer(item) ? (
          <Icon
            reverse
            onPress={onCreateNewItem}
            color={theme.colors.primary}
            type="material"
            name="add"
            size={30}
          />
        ) : (
          <>
            <Icon
              reverse
              onPress={increaseInQuantity}
              color={theme.colors.primary}
              type="material"
              name="add"
              size={30}
            />
            <Icon
              reverse
              onPress={removeInQuantity}
              color={theme.colors.primary}
              type="material"
              name="remove"
              size={30}
            />
          </>
        )}
      </FabContainer>
    </SafeAreaView>
  );
};

const ItemDetails = ({ itemId, navigation }: { itemId: string; navigation: NavigatorProps }) => {
  const scrollPropsAndRef = useCollapsibleScene<Route>("first");
  const item = useSelector<State, Item>((state) => state.inventory.present.items[itemId]);
  if (!IsContainer(item)) {
    return (
      <Animated.ScrollView {...scrollPropsAndRef}>
        <ItemCard item={item} />
      </Animated.ScrollView>
    );
  } else {
    return (
      <Animated.FlatList
        {...scrollPropsAndRef}
        data={item.itemsInside}
        renderItem={({ item: itemId }) => (
          <ItemListCard
            itemId={itemId}
            onTap={(item) => navigation.push("ItemDetails", { itemId: item.id })}
          />
        )}
        keyExtractor={(itemId: string) => itemId}
        ListEmptyComponent={
          <EmptyBasic text="No items" icon={{ name: "box-open", type: "font-awesome-5" }} />
        }
      />
    );
  }
};

const ItemHistory = ({ itemId }: { itemId: string; navigation: NavigatorProps }) => {
  const historyItemIds = useSelector<State, string[]>((state) => {
    return (state.inventory.present.historyIdByItemId[itemId] ?? []).slice();
  });
  const scrollPropsAndRef = useCollapsibleScene<Route>("second");
  return (
    <Animated.FlatList
      {...scrollPropsAndRef}
      data={(historyItemIds ?? []).reverse()}
      renderItem={({ item: historyItemId }) => <HistoryItemCard historyItemId={historyItemId} />}
      keyExtractor={(itemId: string) => itemId}
      ListEmptyComponent={<EmptyBasic text="No history" icon={{ name: "eco", type: "material" }} />}
    />
  );
};

const ItemHeader = ({ item, theme }: { item: Item; theme: Theme }) => {
  const parentPath = useSelector<State, string[]>((state) => {
    if (item) {
      return getParentPath(item, state.inventory.present);
    }
    return [];
  });
  const itemsInside = useSelector<State, number>((state) => {
    if (item && IsContainer(item)) {
      return getNumberOfItemsInside(item, state.inventory.present);
    }
    return 0;
  });
  return (
    <>
      <TitleContainer pointerEvents="none" style={{ backgroundColor: theme.colors.white }}>
        <ItemIconContainer size="md" isContainer={IsContainer(item)} icon={item.icon} />
        <TitleContent>
          <Text h3 style={{ fontWeight: "bold" }}>
            {item.name}
          </Text>
          <Text>{dateFormat(item.createdAtUTC, "ddd mmm dS 'yy")}</Text>
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
  );
};

const InfoBar = ({ item, contains }: { item: Item; contains?: number }) => {
  const { theme } = useContext(ThemeContext);
  if (!IsContainer(item)) return null;
  return (
    <InfoBarContainer theme={theme}>
      <>
        <InfoTag info={`Types of items: ${item.itemsInside.length}`} />
        {contains != null ? <InfoTag info={`All items inside: ${contains}`} /> : null}
      </>
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

const ItemIconContainer = styled(ItemIcon)({ marginLeft: 5, marginRight: 15 });

const ContainerPath = styled(Text)<ThemeProps>((props) => ({
  color: props.theme.colors.grey2,
}));

const InfoBarContainer = styled(View)<ThemeProps>((props) => ({
  backgroundColor: props.theme.colors.grey5,
  padding: 5,
  flexDirection: "row",
  justifyContent: "center",
}));

const PathIcon = styled(Icon)({ marginRight: 5 });

const FabContainer = styled(View)({
  zIndex: 1000,
  position: "absolute",
  bottom: 50,
  right: 30,
  display: "flex",
  flexDirection: "column",
});
