import React, { useState } from "react";
import { NavigationContainer, Theme } from "@react-navigation/native";
import { HomeScreen } from "../../Pages/Home";
import { createStackNavigator } from "@react-navigation/stack";
import { RouteParams } from "./Routes";
import { DetailsScreen } from "../../Pages/Details";
import { AddItemScreen, EditItemScreen } from "../../Pages/AddItem";
import { ItemDetailsScreen } from "../../Pages/ItemDetails";
import { SearchScreen } from "../../Pages/Search";
import { ItemPredicate, OnItemTap, SearchContext } from "./searchContext";
import { OnEmojiTap, EmojiSelectorContext } from "./emojiSelectorContext";
import { EmojiSelectorScreen } from "../../Pages/EmojiSelector";
import { ThemeContext } from "react-native-elements";
import { ViewStyle } from "react-native";

const { Navigator: MainNavigator, Screen: MainScreen } = createStackNavigator<RouteParams>();
const { Navigator: RootNavigator, Screen: RootScreen } = createStackNavigator<RouteParams>();

const headerStyle: ViewStyle = { elevation: 0, borderBottomWidth: 1 };

const MainNavigation = () => {
  return (
    <MainNavigator screenOptions={{ headerStyle }}>
      <MainScreen name="Home" component={HomeScreen} />
      <MainScreen name="Details" component={DetailsScreen} />
      <MainScreen name="ItemDetails" component={ItemDetailsScreen} />
      <MainScreen name="Explore" component={SearchScreen} />
    </MainNavigator>
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

export const AppNavigator = () => {
  const [onItemTap, setOnItemTap] = useSettableCallback<OnItemTap | undefined>(undefined);
  const [onEmojiTap, setOnEmojiTap] = useSettableCallback<OnEmojiTap | undefined>(undefined);
  const [predicate, setPredicate] = useSettableCallback<ItemPredicate | undefined>(undefined);

  const themeContext = React.useContext(ThemeContext);

  return (
    <SearchContext.Provider value={{ onItemTap, setOnItemTap, predicate, setPredicate }}>
      <EmojiSelectorContext.Provider value={{ onEmojiTap, setOnEmojiTap }}>
        <NavigationContainer theme={{ ...themeContext.theme, dark: false } as Theme}>
          <RootNavigator mode="modal" screenOptions={{ headerStyle }}>
            <RootScreen name="Main" component={MainNavigation} options={{ headerShown: false }} />
            <RootScreen name="AddItem" component={AddItemScreen} options={{ title: "Add new item" }} />
            <RootScreen name="EditItem" component={EditItemScreen} options={{ title: "Edit item" }} />
            <MainScreen name="Search" component={SearchScreen} />
            <MainScreen name="EmojiSelector" component={EmojiSelectorScreen} />
          </RootNavigator>
        </NavigationContainer>
      </EmojiSelectorContext.Provider>
    </SearchContext.Provider>
  );
};
