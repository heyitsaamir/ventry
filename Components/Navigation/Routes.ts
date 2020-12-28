import { StackNavigationProp } from "@react-navigation/stack";

export type RouteParams = {
  Home: undefined;
  Details: undefined;
  AddItem: undefined;
};

export type NavigatorProps<TKey extends keyof RouteParams> = StackNavigationProp<RouteParams, TKey>;