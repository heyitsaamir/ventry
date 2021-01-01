import React from "react";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { HomeScreen } from "../../Pages/Home";
import { createStackNavigator } from "@react-navigation/stack";
import { RouteParams } from "./Routes";
import { DetailsScreen } from "../../Pages/Details";
import { ThemeContext } from "../../Theme/theme-context";
import { AddItemScreen } from "../../Pages/AddItem";
import { ItemList } from "../../Pages/ItemList";
import { SearchScreen } from "../../Pages/Search";

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

export const AppNavigator = () => {
  const themeContext = React.useContext(ThemeContext);

  return (
    <NavigationContainer theme={themeContext.theme === "dark" ? DarkTheme : DefaultTheme}>
      <RootNavigator mode="modal">
        <RootScreen name="Main" component={MainNavigation} options={{ headerShown: false }} />
        <RootScreen name="AddItem" component={AddItemScreen} options={{ title: "Add new item" }} />
        <MainScreen name="Search" component={SearchScreen} />
      </RootNavigator>
    </NavigationContainer>
  );
};
