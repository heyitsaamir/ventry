import React, { useContext } from "react";
import { SafeAreaView } from "react-native";
import { NavigatorProps, ScreenProps } from "../../Components/Navigation/Routes";
import { Item, State } from "../../Store/types";
import { useSelector } from "react-redux";
import { useFuse } from "../../lib/fuse/useFuse";
import { SearchList } from "./list";
import { Icon, SearchBar, ThemeContext } from "react-native-elements";
import { ItemPredicate, OnItemTap, SearchContext } from "../../Components/Navigation/searchContext";
import { useTheme } from "../../Components/Theme";

interface Props extends ScreenProps<"Search"> {
  navigation: NavigatorProps<"Search">;
}
const useInputState = (initialValue = "") => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};

export const SearchScreen = ({}: Props) => {
  const searchInputState = useInputState();
  const { theme } = useTheme();
  const { onItemTap, predicate } = useContext(SearchContext);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SearchBar
        placeholder="Search"
        lightTheme
        {...searchInputState}
        searchIcon={<Icon type="material" name="search" color={theme.colors.grey3} />}
      />
      <SearchedItems
        searchTerm={searchInputState.value}
        predicate={predicate}
        onItemTap={onItemTap}
        display={SearchList}
      />
    </SafeAreaView>
  );
};

export const SearchedItems = ({
  searchTerm,
  predicate,
  onItemTap,
  display: Display,
}: {
  searchTerm: string;
  predicate?: ItemPredicate;
  onItemTap?: OnItemTap;
  display: (props: { items: Item[]; onItemTap?: OnItemTap }) => JSX.Element | null;
}) => {
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
  const result = fuse.search(searchTerm);

  return <Display items={searchTerm === "" ? items : result.map((r) => r.item)} onItemTap={onItemTap} />;
};
