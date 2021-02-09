import React, { useContext } from "react";
import { SafeAreaView } from "react-native";
import { Icon, SearchBar, Text, ThemeContext } from "react-native-elements";
import { NavigatorProps, ScreenProps } from "../../Components/Navigation/Routes";
import { SearchedItems } from "../Search";
import { SearchList } from "../Search/list";

interface Props extends ScreenProps<"Explore"> {
  navigation: NavigatorProps<"Explore">;
}

const useInputState = (initialValue = "") => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};

export const ExploreScreen = ({ navigation }: Props) => {
  const searchInputState = useInputState();
  const { theme } = useContext(ThemeContext);

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
      <SearchedItems
        searchTerm={searchInputState.value}
        onItemTap={(item) => navigation.push("ItemDetails", { itemId: item.id })}
        display={SearchList}
      />
    </SafeAreaView>
  );
};
