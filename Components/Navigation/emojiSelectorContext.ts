import React from "react";

export type OnEmojiTap = (item: string) => void;

export const EmojiSelectorContext = React.createContext<{
  onEmojiTap?: OnEmojiTap;
  setOnEmojiTap: (fn?: OnEmojiTap) => void;
}>({
  onEmojiTap: undefined,
  setOnEmojiTap: (fn?: OnEmojiTap) => { },
});
