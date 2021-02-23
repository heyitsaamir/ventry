import React, { ComponentProps, useMemo, useRef, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { Button, Icon, Input, SearchBar, Text } from "react-native-elements";
import Animated, { Easing } from "react-native-reanimated";
import { NavIcon } from "../../Components/Navigation/RightNavItemContainer";
import { NavigatorProps, ScreenProps } from "../../Components/Navigation/Routes";
import useCustomNav, { RightNavButtonElement } from "../../Components/Navigation/useCustonNav";
import { useTheme } from "../../Components/Theme";
import { useAnimation } from "../../lib/hooks/useAnimation";
import CameraInput from "../AddItem/cameraInput";
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
  const { theme } = useTheme();
  const animation = useAnimation({
    doAnimation: !!searchInputState.value,
    duration: 200,
  });
  const [showScanner, setShowScanner] = useState(false);
  const navButtons: RightNavButtonElement = (props) => {
    return (
      <Animated.View
        style={[
          {
            height: animation.interpolate({ inputRange: [0, 1], outputRange: [0, 30] }),
          },
          { flexDirection: "row" },
        ]}
      >
        <NavIcon
          color={props.tintColor}
          type="material-community"
          name="barcode-scan"
          onPress={() => setShowScanner(true)}
        />
      </Animated.View>
    );
  };
  useCustomNav({
    rightButtons: navButtons,
  });
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.Text
        style={[
          {
            padding: 10,
            fontWeight: "bold",
            color: theme.colors.text,
            fontSize: 40,
          },
          {
            paddingTop: animation.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }),
            maxHeight: animation.interpolate({ inputRange: [0, 1], outputRange: [300, 0] }),
          },
        ]}
      >
        Search your inventory
      </Animated.Text>
      <SearchBar
        placeholder="Search with name / upc / tags"
        {...searchInputState}
        containerStyle={{
          backgroundColor: theme.colors.background,
          borderTopWidth: 0,
          borderBottomWidth: 0,
        }}
        inputContainerStyle={{ backgroundColor: theme.colors.primary }}
        placeholderTextColor={theme.colors.grey3}
        inputStyle={{ color: theme.colors.background }}
        searchIcon={<Icon type="material" name="search" color={theme.colors.grey3} />}
        cancelButtonProps={{ color: theme.colors.border }}
        round
      />
      <Animated.View
        style={{
          height: animation.interpolate({ inputRange: [0, 1], outputRange: [56, 0] }),
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Button
            type="outline"
            icon={{ type: "material-community", name: "barcode-scan" }}
            containerStyle={{ flex: 1, margin: 5 }}
            onPress={() => setShowScanner(true)}
          />
        </View>
      </Animated.View>
      {!!searchInputState.value && (
        <SearchedItems
          searchTerm={searchInputState.value}
          onItemTap={(item) => navigation.push("ItemDetails", { itemId: item.id })}
          display={CustomSearchList}
        />
      )}
      <CameraInput
        title={`Scan your item's barcode`}
        isVisible={showScanner}
        dismiss={() => {
          setShowScanner(false);
        }}
        input={{
          type: "Barcode",
          onBarcodeScanned: (text) => {
            if (text != null) searchInputState.onChangeText(text);
            setShowScanner(false);
          },
        }}
      />
    </SafeAreaView>
  );
};

const CustomSearchList = (props: ComponentProps<typeof SearchList>) => {
  if (props.items.length === 0) return null;
  return <SearchList {...props} />;
};
