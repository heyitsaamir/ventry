import React from "react";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { HomeScreen } from "../../Pages/Home";
import { Drawer, DrawerItem, IndexPath } from "@ui-kitten/components";
import { createStackNavigator } from "@react-navigation/stack";
import { RouteParams } from "./Routes";
import { DetailsScreen } from "../../Pages/Details";
import { ThemeContext } from "../../Theme/theme-context";
import { AddItemScreen } from "../../Pages/AddItem";

const { Navigator, Screen } = createStackNavigator<RouteParams>();

export const AppNavigator = () => {
  const themeContext = React.useContext(ThemeContext);

  return (
    <NavigationContainer theme={themeContext.theme === "dark" ? DarkTheme : DefaultTheme}>
      <Navigator>
        <Screen name="Home" component={HomeScreen} />
        <Screen name="Details" component={DetailsScreen} />
        <Screen name="AddItem" component={AddItemScreen} options={{ title: "Add new item" }} />
      </Navigator>
    </NavigationContainer>
  );
};
