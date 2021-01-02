import React, { useContext, useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { ThemeContext } from "../../Theme/theme-context";
import styled from "@emotion/native";
import { NavigatorProps, ScreenProps, useNav } from "../../Components/Navigation/Routes";
import { Item, State } from "../../Store/types";
import { useSelector } from "react-redux";
import { useFuse } from "../../lib/fuse/useFuse";
import { SearchList } from "./list";
import { SearchBar } from "react-native-elements";
import { SearchContext } from "../../Components/Navigation/searchContext";

const useInputState = (initialValue = "") => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};

interface Props extends ScreenProps<"Search"> {
  navigation: NavigatorProps<"Search">;
}

export const SearchScreen = ({
  navigation,
  route: { params: { containersOnly } = { containersOnly: false } },
}: Props) => {
  const { onItemTap } = useContext(SearchContext);
  const items = useSelector<State, Item[]>((state) =>
    Object.values(state.inventory.items).filter((item) => {
      if (containersOnly === true) {
        return item.type === "Container";
      }
      return true;
    })
  );
  const fuse = useFuse(items, {
    keys: ["name", "upc"],
    threshold: 0.5,
    ignoreLocation: true,
    minMatchCharLength: 1,
  });

  const searchInputState = useInputState();
  const result = fuse.search(searchInputState.value);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SearchBar platform="default" placeholder="Search" {...searchInputState} />
      <SearchList
        items={searchInputState.value === "" ? items : result.map((r) => r.item)}
        onTap={onItemTap}
      />
    </SafeAreaView>
  );
};

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
