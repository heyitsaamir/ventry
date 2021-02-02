import React, { useContext, useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import styled from "@emotion/native";
import { NavigatorProps, ScreenProps, useNav } from "../../Components/Navigation/Routes";
import { Item, State } from "../../Store/types";
import { useSelector } from "react-redux";
import { useFuse } from "../../lib/fuse/useFuse";
import { SearchList } from "./list";
import { Icon, SearchBar, ThemeContext } from "react-native-elements";
import { SearchContext } from "../../Components/Navigation/searchContext";

const useInputState = (initialValue = "") => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};

interface Props extends ScreenProps<"Search"> {
  navigation: NavigatorProps<"Search">;
}

export const SearchScreen = ({ navigation }: Props) => {
  const { onItemTap, predicate } = useContext(SearchContext);
  const items = useSelector<State, Item[]>((state) => {
    if (predicate) {
      return predicate(state.inventory.present.items);
    } else {
      return Object.values(state.inventory.present.items);
    }
  });
  const fuse = useFuse(items, {
    keys: ["name", "upc"],
    threshold: 0.5,
    ignoreLocation: true,
    minMatchCharLength: 1,
  });

  const searchInputState = useInputState();
  const { theme } = useContext(ThemeContext);
  const result = fuse.search(searchInputState.value);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SearchBar
        placeholder="Search"
        {...searchInputState}
        placeholderTextColor={theme.colors.border}
        inputStyle={{ color: theme.colors.background }}
        searchIcon={<Icon type="material" name="search" color={theme.colors.border} />}
        cancelButtonProps={{ color: theme.colors.border }}
      />
      <SearchList
        items={searchInputState.value === "" ? items : result.map((r) => r.item)}
        onTap={onItemTap}
      />
    </SafeAreaView>
  );
};
