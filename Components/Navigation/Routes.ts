import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { Item } from "../../Store/types";

export type RouteParams = {
  Home: undefined;
  Details: undefined;
  AddItem: {
    parentItemId: string
  };
  ItemList: {
    itemId: string
  }
  Main: undefined;
  Search: {
    containersOnly?: boolean;
  }
};

export type NavigatorProps<TKey extends keyof RouteParams> = StackNavigationProp<RouteParams, TKey>;
export type ScreenProps<TKey extends keyof RouteParams> = StackScreenProps<RouteParams, TKey>
export const useNav = () => useNavigation<NavigatorProps<keyof RouteParams>>();