import { CommonActions, NavigationState, Route } from "@react-navigation/native";
import { RouteParams } from "../Routes";

export const removeItemFromNavStack = (itemId: string) => (state: NavigationState<RouteParams>) => {
  const routesWithoutItem = removeItemIdFromRoutes(itemId, state.routes);
  return CommonActions.reset({
    ...state,
    routes: routesWithoutItem,
    index: routesWithoutItem.length - 1,
  });
};

const removeItemIdFromRoutes = (
  itemId: string,
  routes: NavigationState<RouteParams>["routes"]
): NavigationState<RouteParams>["routes"] => {
  return routes.reduce((newRouteList, route) => {
    if (route.name === "EditItem" || route.name === "ItemDetails") {
      if ((route.params as RouteParams["EditItem"] | RouteParams["ItemDetails"]).itemId === itemId) {
        return newRouteList;
      }
    } else if ((route.name === "Main" || route.name === 'AccountTab' || route.name === 'ExploreTab') && route.state) {
      const { routes, ...otherStateValues } = route.state as NavigationState<RouteParams>;
      if (routes) {
        const newMainRoutes = removeItemIdFromRoutes(itemId, routes);
        newRouteList.push({
          ...route,
          state: { ...otherStateValues, routes: newMainRoutes, index: newMainRoutes.length - 1 },
        });
        return newRouteList;
      }
    }
    newRouteList.push(route);
    return newRouteList;
  }, [] as NavigationState<RouteParams>["routes"]);
};
