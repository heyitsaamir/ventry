import React, { useState } from "react";
import { NavigationContainer, Theme } from "@react-navigation/native";
import { HomeScreen } from "../../Pages/Home";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RouteParams } from "./Routes";
import { DetailsScreen } from "../../Pages/Details";
import { AddItemScreen, EditItemScreen } from "../../Pages/AddItem";
import { ItemDetailsScreen } from "../../Pages/ItemDetails";
import { SearchScreen } from "../../Pages/Search";
import { ItemPredicate, OnItemTap, SearchContext } from "./searchContext";
import { OnEmojiTap, EmojiSelectorContext } from "./emojiSelectorContext";
import { EmojiSelectorScreen } from "../../Pages/EmojiSelector";
import { Icon, Text, ThemeContext } from "react-native-elements";
import { ViewStyle } from "react-native";

const { Navigator: ExploreNavigator, Screen: ExploreScreen } = createStackNavigator<
  Pick<RouteParams, "Search">
>();
const { Navigator: AccountNavigator, Screen: AccountScreen } = createStackNavigator<
  Pick<RouteParams, "ItemDetails">
>();
const { Navigator: RootNavigator, Screen: RootScreen } = createStackNavigator<
  Pick<RouteParams, "EmojiSelector" | "Main" | "Search" | "AddItem" | "EditItem">
>();
const { Navigator: TabNavigator, Screen: TabScreen } = createBottomTabNavigator<
  Pick<RouteParams, "Account" | "Explore">
>();

const headerStyle: ViewStyle = { elevation: 0, borderBottomWidth: 1 };

const ExploreNavigation = () => {
  return (
    <ExploreNavigator screenOptions={{ headerStyle }}>
      <ExploreScreen name="Search" component={SearchScreen} />
    </ExploreNavigator>
  );
};

const AccountNavigation = () => {
  return (
    <AccountNavigator screenOptions={{ headerStyle }}>
      <AccountScreen name="ItemDetails" component={ItemDetailsScreen} initialParams={{ itemId: "" }} />
    </AccountNavigator>
  );
};

function setCB<T>(setter: (setterCb?: () => T) => void) {
  return (cb?: T) => {
    setter(() => cb);
  };
}

function useSettableCallback<T extends Function | undefined>(callback: T): [T, (cb: T) => void] {
  const [cb, setCallback] = useState<T>(callback);
  const settableCb = setCB<T>(setCallback);
  return [cb, settableCb];
}

const ExploreTabNavigator = () => {
  const [onItemTap, setOnItemTap] = useSettableCallback<OnItemTap | undefined>(undefined);
  const [onEmojiTap, setOnEmojiTap] = useSettableCallback<OnEmojiTap | undefined>(undefined);
  const [predicate, setPredicate] = useSettableCallback<ItemPredicate | undefined>(undefined);

  return (
    <SearchContext.Provider value={{ onItemTap, setOnItemTap, predicate, setPredicate }}>
      <EmojiSelectorContext.Provider value={{ onEmojiTap, setOnEmojiTap }}>
        <RootNavigator mode="modal" screenOptions={{ headerStyle }} initialRouteName="Main">
          <RootScreen name="Main" component={ExploreNavigation} options={{ headerShown: false }} />
          <RootScreen name="AddItem" component={AddItemScreen} options={{ title: "Add new item" }} />
          <RootScreen name="EditItem" component={EditItemScreen} options={{ title: "Edit item" }} />
          <RootScreen name="Search" component={SearchScreen} />
          <RootScreen name="EmojiSelector" component={EmojiSelectorScreen} />
        </RootNavigator>
      </EmojiSelectorContext.Provider>
    </SearchContext.Provider>
  );
};

const AccountTabNavigator = () => {
  const [onItemTap, setOnItemTap] = useSettableCallback<OnItemTap | undefined>(undefined);
  const [onEmojiTap, setOnEmojiTap] = useSettableCallback<OnEmojiTap | undefined>(undefined);
  const [predicate, setPredicate] = useSettableCallback<ItemPredicate | undefined>(undefined);

  return (
    <SearchContext.Provider value={{ onItemTap, setOnItemTap, predicate, setPredicate }}>
      <EmojiSelectorContext.Provider value={{ onEmojiTap, setOnEmojiTap }}>
        <RootNavigator mode="modal" screenOptions={{ headerStyle }} initialRouteName="Main">
          <RootScreen name="Main" component={AccountNavigation} options={{ headerShown: false }} />
          <RootScreen name="AddItem" component={AddItemScreen} options={{ title: "Add new item" }} />
          <RootScreen name="EditItem" component={EditItemScreen} options={{ title: "Edit item" }} />
          <RootScreen name="Search" component={SearchScreen} />
          <RootScreen name="EmojiSelector" component={EmojiSelectorScreen} />
        </RootNavigator>
      </EmojiSelectorContext.Provider>
    </SearchContext.Provider>
  );
};

export const AppNavigator = () => {
  const themeContext = React.useContext(ThemeContext);

  return (
    <NavigationContainer theme={{ ...themeContext.theme, dark: false } as Theme}>
      <TabNavigator>
        <TabScreen
          name="Account"
          component={AccountTabNavigator}
          options={{
            tabBarLabel: "Items",
            tabBarIcon: (iconProps) => <Icon type="font-awesome-5" name="box-open" {...iconProps} />,
          }}
        />
        <TabScreen
          name="Explore"
          component={ExploreTabNavigator}
          options={{
            tabBarIcon: (iconProps) => <Icon name="search" type="material" {...iconProps} />,
          }}
        />
      </TabNavigator>
    </NavigationContainer>
  );
};
