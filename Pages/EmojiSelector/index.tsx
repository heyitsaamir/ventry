import React, { useContext, useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { ThemeContext } from "../../Theme/theme-context";
import styled from "@emotion/native";
import { NavigatorProps, ScreenProps, useNav } from "../../Components/Navigation/Routes";
import { Item, State } from "../../Store/types";
import { useSelector } from "react-redux";
import { useFuse } from "../../lib/fuse/useFuse";
import { SearchBar } from "react-native-elements";
import { SearchContext } from "../../Components/Navigation/searchContext";
import { EmojiSelectorContext } from "../../Components/Navigation/emojiSelectorContext";
import EmojiSelector from "react-native-emoji-selector";

const useInputState = (initialValue = "") => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};

interface Props extends ScreenProps<"EmojiSelector"> {
  navigation: NavigatorProps<"EmojiSelector">;
}

export const EmojiSelectorScreen = ({ navigation }: Props) => {
  const { onEmojiTap } = useContext(EmojiSelectorContext);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <EmojiSelector onEmojiSelected={onEmojiTap} />
    </SafeAreaView>
  );
};
