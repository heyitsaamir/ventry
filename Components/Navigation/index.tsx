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
import { Item } from "../../Store/types";
import CameraScreen from "../../Pages/AddItem/camera";
import { OnBarcodeScanned, CameraContext } from "./cameraContext";

const { Navigator: MainNavigator, Screen: MainScreen } = createStackNavigator<RouteParams>();
const { Navigator: RootNavigator, Screen: RootScreen } = createStackNavigator<RouteParams>();

const MainNavigation = () => {
  const themeContext = React.useContext(ThemeContext);

  return (
    <MainNavigator>
      <MainScreen name="Home" component={HomeScreen} />
      <MainScreen name="Details" component={DetailsScreen} />
      <MainScreen name="ItemList" component={ItemList} />
    </MainNavigator>
  );
};

function setCB<T>(setter: (setterCb?: () => T) => void) {
  return (cb?: T) => {
    setter(() => cb);
  };
}

export const AppNavigator = () => {
  const [onItemTap, setOnTap] = useState<OnItemTap | undefined>(undefined);
  const [onBarcodeScanned, setBarcodeScanned] = useState<OnBarcodeScanned | undefined>(undefined);

  const setOnItemTap = setCB<OnItemTap>(setOnTap);
  const setOnBarcodeScanned = setCB<OnBarcodeScanned>(setBarcodeScanned);

  const themeContext = React.useContext(ThemeContext);

  return (
    <SearchContext.Provider value={{ onItemTap, setOnItemTap }}>
      <CameraContext.Provider value={{ onBarcodeScanned, setOnBarcodeScanned }}>
        <NavigationContainer theme={themeContext.theme === "dark" ? DarkTheme : DefaultTheme}>
          <RootNavigator mode="modal">
            <RootScreen name="Main" component={MainNavigation} options={{ headerShown: false }} />
            <RootScreen name="AddItem" component={AddItemScreen} options={{ title: "Add new item" }} />
            <MainScreen name="Search" component={SearchScreen} />
            <MainScreen name="AddItemUsingCamera" component={CameraScreen} />
          </RootNavigator>
        </NavigationContainer>
      </CameraContext.Provider>
    </SearchContext.Provider>
  );
};
