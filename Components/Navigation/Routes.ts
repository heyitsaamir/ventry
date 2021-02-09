import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { Item } from "../../Store/types";

export type RouteParams = {
  Home: undefined;
  Details: undefined;
  AddItem: {
    parentItemId: string;
  };
  EditItem: {
    itemId: string;
  };
  ItemDetails: {
    itemId: string;
  };
  Main: undefined;
  Search: undefined;
  EmojiSelector: undefined;
  Account: undefined;
  Explore: undefined;
};

export type NavigatorProps<TKey extends keyof RouteParams = keyof RouteParams> = StackNavigationProp<
  RouteParams,
  TKey
>;
export type ScreenProps<TKey extends keyof RouteParams> = StackScreenProps<RouteParams, TKey>;
export const useNav = () => useNavigation<NavigatorProps<keyof RouteParams>>();
