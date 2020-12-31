import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button, Divider, Input, Layout, Text } from "@ui-kitten/components";
import { ThemeContext } from "../../Theme/theme-context";
import styled from "@emotion/native";
import { NavigatorProps, ScreenProps, useNav } from "../../Components/Navigation/Routes";
import { Item, State } from "../../Store/types";
import { useSelector } from "react-redux";
import { useFuse } from "../../lib/fuse/useFuse";
import { SearchList } from "./list";

const useInputState = (initialValue = "") => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};

interface Props extends ScreenProps<"Search"> {
  navigation: NavigatorProps<"Search">;
}

export const SearchScreen = ({
  navigation,
  route: {
    params: { containersOnly, onTap },
  },
}: Props) => {
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
      <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <SearchInput size="large" placeholder="Search" {...searchInputState} />
        <Divider />
        <SearchList items={searchInputState.value === "" ? items : result.map((r) => r.item)} onTap={onTap} />
      </Layout>
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
