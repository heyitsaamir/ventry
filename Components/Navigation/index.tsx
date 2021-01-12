import React, { useState } from "react";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { HomeScreen } from "../../Pages/Home";
import { createStackNavigator } from "@react-navigation/stack";
import { RouteParams } from "./Routes";
import { DetailsScreen } from "../../Pages/Details";
import { ThemeContext } from "../../Theme/theme-context";
import { AddItemScreen } from "../../Pages/AddItem";
import { ItemList } from "../../Pages/ItemList";
import { SearchScreen } from "../../Pages/Search";
import { OnItemTap, SearchContext } from "./searchContext";
import { OnEmojiTap, EmojiSelectorContext } from "./emojiSelectorContext";
import { OnBarcodeScanned, CameraContext } from "./cameraContext";
import { EmojiSelectorScreen } from "../../Pages/EmojiSelector";

const { Navigator: MainNavigator, Screen: MainScreen } = createStackNavigator<RouteParams>();
const { Navigator: RootNavigator, Screen: RootScreen } = createStackNavigator<RouteParams>();

const MainNavigation = () => {
  const themeContext = React.useContext(ThemeContext);

  return (
    <MainNavigator>
      <MainScreen name="Home" component={HomeScreen} />
      <MainScreen name="Details" component={DetailsScreen} />
      <MainScreen name="ItemList" component={ItemList} />
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

  const themeContext = React.useContext(ThemeContext);

  return (
    <SearchContext.Provider value={{ onItemTap, setOnItemTap }}>
      <EmojiSelectorContext.Provider value={{ onEmojiTap, setOnEmojiTap }}>
        <NavigationContainer theme={themeContext.theme === "dark" ? DarkTheme : DefaultTheme}>
          <RootNavigator mode="modal">
            <RootScreen name="Main" component={MainNavigation} options={{ headerShown: false }} />
            <RootScreen name="AddItem" component={AddItemScreen} options={{ title: "Add new item" }} />
            <MainScreen name="Search" component={SearchScreen} />
            <MainScreen name="EmojiSelector" component={EmojiSelectorScreen} />
          </RootNavigator>
        </NavigationContainer>
      </EmojiSelectorContext.Provider>
    </SearchContext.Provider>
  );
};
