import React, { useCallback, useMemo, useRef } from "react";
import { Animated, Easing, SafeAreaView, View } from "react-native";
import styled from "@emotion/native";
import { useSelector } from "react-redux";
import { Item, State } from "../../Store/types";
import { NavigatorProps, ScreenProps, useNav } from "../../Components/Navigation/Routes";
import { Icon, Text } from "react-native-elements";
import ItemIcon from "../../Components/ItemIcon";
import { getNumberOfItemsInside, getParentPath, IsContainer } from "../../lib/modelUtilities/itemUtils";
import { ThemeProps } from "../../Components/Theme/types";
import InfoTag from "../../Components/InfoTag";
import useCustomNav, { RightNavButtonOptions } from "../../Components/Navigation/useCustonNav";
import { ItemListCard } from "../../Components/ItemListCard";
import { SceneMap } from "react-native-tab-view";
import { CollapsibleTabView, useCollapsibleScene } from "react-native-collapsible-tab-view";
import { HistoryItemCard } from "../../Components/ItemListCard/historyItem";
import dateFormat from "dateformat";
import { EmptyBasic } from "../../Components/Empty/EmptyBasic";
import { useAppDispatch } from "../../Store";
import { changeInQuantity } from "../../Store/inventory";
import { ItemCard } from "./Card";
import { Theme, useTheme } from "../../Components/Theme";
import TextTicker from "react-native-text-ticker";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

type Route = {
  key: "first" | "second";
  title: string;
};

interface Props extends ScreenProps<"ItemDetails"> {
  navigation: NavigatorProps<"ItemDetails">;
}

export const ItemDetailsScreen = ({ route }: Props) => {
  const itemId = route.params.itemId;
  const item = useSelector<State, Item | undefined>((state) => state.inventory.present.items[itemId]);
  const [index, setIndex] = React.useState(0);
  const nav = useNav();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const navButtons = useMemo(() => {
    if (!item) return [];
    const navButtons: RightNavButtonOptions[] = [];
    navButtons.push({
      name: "edit",
      type: "material",
      onPress: () => nav.navigate("EditItem", { itemId: item.id }),
    });
    return navButtons;
  }, [item]);
  useCustomNav({
    title: item?.name,
    rightButtons: navButtons,
  });

  const onCreateNewItem = useCallback(() => {
    if (item && IsContainer(item)) {
      nav.navigate("AddItem", { parentItemId: item.id });
    }
  }, [nav, item]);

  const increaseInQuantity = useCallback(() => {
    if (item && !IsContainer(item)) {
      dispatch(changeInQuantity({ itemId: item.id, type: "addOne" }));
    }
  }, [dispatch, item]);
  const removeInQuantity = useCallback(() => {
    if (item && !IsContainer(item)) {
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
  }, [itemId, nav, item?.type]);
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
        {item && IsContainer(item) ? (
          <Icon
            reverse
            onPress={onCreateNewItem}
            color={theme.colors.primary}
            type="material-community"
            name="plus"
            size={30}
          />
        ) : (
          <>
            <Icon
              reverse
              onPress={increaseInQuantity}
              color={theme.colors.primary}
              type="material-community"
              name="arrow-up-bold"
              size={30}
            />
            <Icon
              reverse
              onPress={removeInQuantity}
              color={theme.colors.primary}
              type="material-community"
              name="arrow-down-bold"
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

  const marqueeRef = useRef<any>(null);
  return (
    <>
      <TitleContainer style={{ backgroundColor: theme.colors.white }}>
        <ItemIconContainer size="md" isContainer={IsContainer(item)} icon={item.icon} />
        <TitleContent
          onPress={() => {
            console.log("foo");
            marqueeRef.current?.startAnimation(10);
          }}
        >
          <TextTicker
            numberOfLines={1}
            ellipsizeMode={"tail"}
            ref={marqueeRef}
            marqueeOnMount={false}
            loop={false}
            style={{ fontWeight: "bold", fontSize: 30 }}
          >
            {item.name}
          </TextTicker>
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
  const { theme } = useTheme();
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

const TitleContent = styled(TouchableWithoutFeedback)({ flex: 1 });

const ItemIconContainer = styled(ItemIcon)({ marginLeft: 5, marginRight: 15 });

const ContainerPath = styled(Text)((props) => ({
  color: props.theme.colors.grey2,
}));

const InfoBarContainer = styled(View)((props) => ({
  backgroundColor: props.theme.colors.grey5,
  padding: 5,
  flexDirection: "row",
  justifyContent: "center",
}));

const PathIcon = styled(Icon)({ marginRight: 5 });

const FabContainer = styled(View)({
  zIndex: 1000,
  position: "absolute",
  bottom: 10,
  right: 30,
  display: "flex",
  flexDirection: "column",
});
