import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { ThemeContext } from "../../Theme/theme-context";
import styled from "@emotion/native";
import { NavigatorProps } from "../../Components/Navigation/Routes";
import { Button, Input, Text } from "react-native-elements";
import { SearchContext } from "../../Components/Navigation/searchContext";

const useInputState = (initialValue = "") => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};

interface Props {
  navigation: NavigatorProps<"Home">;
}

export const HomeScreen = ({ navigation }: Props) => {
  const themeContext = React.useContext(ThemeContext);
  const searchContext = React.useContext(SearchContext);

  const largeInputState = useInputState();
  const navigateSearch = () => {
    searchContext.setOnItemTap((item) => {
      navigation.navigate("ItemList", { itemId: item.id });
    });
    navigation.navigate("Search");
  };

  const navigateAddItem = () => {
    navigation.navigate("AddItem", { parentItemId: "" });
  };

  const navigateRootList = () => {
    navigation.navigate("ItemList", { itemId: "" });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HorizontalSplit>
        <Input placeholder="Search" {...largeInputState} />
      </HorizontalSplit>
      <HorizontalSplit>
        <Button style={styles.button} onPress={navigateAddItem} title="ADD ITEM" />
        <Button style={styles.button} onPress={navigateSearch} title="OPEN SEARCH" />
        <Button style={styles.button} onPress={themeContext.toggleTheme} title="TOGGLE THEME" />
        <Button style={styles.button} onPress={navigateRootList} title="Root List" />
      </HorizontalSplit>
    </SafeAreaView>
  );
};

const SearchInput = styled(Input)({
  margin: 20,
});

const HorizontalSplit = styled(View)({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
});

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
  },
});
