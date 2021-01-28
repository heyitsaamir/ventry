import React, { useContext } from "react";
import { SafeAreaView } from "react-native";
import { NavigatorProps, ScreenProps } from "../../Components/Navigation/Routes";
import { EmojiSelectorContext } from "../../Components/Navigation/emojiSelectorContext";
import EmojiSelector from "react-native-emoji-selector";

interface Props extends ScreenProps<"EmojiSelector"> {
  navigation: NavigatorProps<"EmojiSelector">;
}

export const EmojiSelectorScreen = ({}: Props) => {
  const { onEmojiTap } = useContext(EmojiSelectorContext);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <EmojiSelector onEmojiSelected={onEmojiTap} />
    </SafeAreaView>
  );
};
