import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { ThemeContext } from "../../Theme/theme-context";
import styled from "@emotion/native";
import { NavigatorProps } from "../../Components/Navigation/Routes";
import { Button, Image, Input, Text } from "react-native-elements";
import { SearchContext } from "../../Components/Navigation/searchContext";
import { useAssets } from "expo-asset";

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
  const [assets, error] = useAssets([require("../../Components/assets/logo.png")]);

  const largeInputState = useInputState();
  const navigateSearch = () => {
    searchContext.setOnItemTap((item) => {
      navigation.navigate("ItemDetails", { itemId: item.id });
    });
    navigation.navigate("Explore");
  };

  const navigateAddItem = () => {
    navigation.navigate("AddItem", { parentItemId: "" });
  };

  const navigateRootList = () => {
    navigation.navigate("ItemDetails", { itemId: "" });
  };

  if (!assets) {
    return <Text>assets: {JSON.stringify(assets)}</Text>;
  }

  if (error) {
    return <Text>err:{error.message}</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HorizontalSplit>
        <Image
          source={{ uri: assets[0].localUri }}
          style={{ height: 100, width: 100 }}
          resizeMode={"cover"}
        />
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
