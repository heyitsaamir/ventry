import React, { useState } from "react";
import { NavigationContainer, Theme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RouteParams } from "./Routes";
import { AddItemScreen, EditItemScreen } from "../../Pages/AddItem";
import { ItemDetailsScreen } from "../../Pages/ItemDetails";
import { SearchScreen } from "../../Pages/Search";
import { ItemPredicate, OnItemTap, SearchContext } from "./searchContext";
import { OnEmojiTap, EmojiSelectorContext } from "./emojiSelectorContext";
import { EmojiSelectorScreen } from "../../Pages/EmojiSelector";
import { Icon, ThemeContext } from "react-native-elements";
import { ViewStyle } from "react-native";
import { ExploreScreen } from "../../Pages/Explore";
import { useSettableCallback } from "../../lib/hooks/useSettableCallback";
import { theme } from "../Theme";

const { Navigator: ExploreTabNavigator, Screen: ExploreTabScreen } = createStackNavigator<
  Pick<RouteParams, "Explore" | "ItemDetails">
>();
const { Navigator: AccountTabNavigator, Screen: AccountScreen } = createStackNavigator<
  Pick<RouteParams, "ItemDetails">
>();
const { Navigator: RootNavigator, Screen: RootScreen } = createStackNavigator<
  Pick<RouteParams, "EmojiSelector" | "Main" | "Search" | "AddItem" | "EditItem">
>();
const { Navigator: TabNavigator, Screen: TabScreen } = createBottomTabNavigator<
  Pick<RouteParams, "AccountTab" | "ExploreTab">
>();

const headerStyle: ViewStyle = { elevation: 0, borderBottomWidth: 1 };

const ExploreNavigation = () => {
  return (
    <ExploreTabNavigator screenOptions={{ headerStyle }}>
      <ExploreTabScreen name="Explore" component={ExploreScreen} />
      <ExploreTabScreen name="ItemDetails" component={ItemDetailsScreen} initialParams={{ itemId: "" }} />
    </ExploreTabNavigator>
  );
};

const AccountNavigation = () => {
  return (
    <AccountTabNavigator screenOptions={{ headerStyle }}>
      <AccountScreen name="ItemDetails" component={ItemDetailsScreen} initialParams={{ itemId: "" }} />
    </AccountTabNavigator>
  );
};

const BottomTabNavigator = () => {
  return (
    <TabNavigator
      tabBarOptions={{
        style: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <TabScreen
        name="ExploreTab"
        component={ExploreNavigation}
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ focused }) => (
            <Icon
              name="search"
              type="material"
              reverse
              raised
              size={10}
              color={focused ? theme.colors.primary : theme.colors.border}
            />
          ),
        }}
      />
      <TabScreen
        name="AccountTab"
        component={AccountNavigation}
        options={{
          tabBarLabel: "Items",
          tabBarIcon: ({ focused }) => (
            <Icon
              type="font-awesome-5"
              name="box-open"
              reverse
              raised
              size={10}
              color={focused ? theme.colors.primary : theme.colors.border}
            />
          ),
        }}
      />
    </TabNavigator>
  );
};

export const AppNavigator = () => {
  const [onItemTap, setOnItemTap] = useSettableCallback<OnItemTap>(undefined);
  const [onEmojiTap, setOnEmojiTap] = useSettableCallback<OnEmojiTap>(undefined);
  const [predicate, setPredicate] = useSettableCallback<ItemPredicate>(undefined);

  const themeContext = React.useContext(ThemeContext);

  return (
    <NavigationContainer theme={{ ...themeContext.theme, dark: false } as Theme}>
      <SearchContext.Provider value={{ onItemTap, setOnItemTap, predicate, setPredicate }}>
        <EmojiSelectorContext.Provider value={{ onEmojiTap, setOnEmojiTap }}>
          <RootNavigator mode="modal" screenOptions={{ headerStyle }} initialRouteName="Main">
            <RootScreen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
            <RootScreen name="AddItem" component={AddItemScreen} options={{ title: "Add new item" }} />
            <RootScreen name="EditItem" component={EditItemScreen} options={{ title: "Edit item" }} />
            <RootScreen name="Search" component={SearchScreen} />
            <RootScreen name="EmojiSelector" component={EmojiSelectorScreen} />
          </RootNavigator>
        </EmojiSelectorContext.Provider>
      </SearchContext.Provider>
    </NavigationContainer>
  );
};
