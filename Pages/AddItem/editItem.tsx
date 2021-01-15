import React, { useCallback, useMemo, useState } from "react";
import { SafeAreaView } from "react-native";
import { useSelector } from "react-redux";
import { NavigatorProps, ScreenProps } from "../../Components/Navigation/Routes";
import { useAppDispatch } from "../../Store";
import { editItem } from "../../Store/inventory";
import { Item, State } from "../../Store/types";
import Form, { FieldType, FieldInfos, FieldInfoArgs } from "./form";

interface Props extends ScreenProps<"EditItem"> {
  navigation: NavigatorProps<"EditItem">;
}

export const EditItemScreen = ({ route, navigation }: Props) => {
  const itemId = route.params!.itemId!;
  const item = useSelector<State, Item>((state: State) => state.inventory.items[itemId]);

  const dispatch = useAppDispatch();
  const editItemCb = useCallback(
    (fieldInfos: FieldInfoArgs) => {
      const isContainer = fieldInfos.get(FieldType.isContainer)?.isContainer;
      const name = fieldInfos.get(FieldType.title)?.title;
      const quantity = fieldInfos.get(FieldType.quantity)?.quantity;
      const upc = fieldInfos.get(FieldType.upc)?.upc;
      const icon = fieldInfos.get(FieldType.icon)?.icon;
      const containerId = fieldInfos.get(FieldType.containerId)?.containerId;
      if (!isContainer) {
        dispatch(
          editItem({
            updatedItem: {
              type: "NonContainer",
              name,
              quantity,
              upc,
              icon,
            },
            originalItemId: itemId,
          })
        );
      } else {
        dispatch(
          editItem({
            updatedItem: {
              type: "Container",
              name,
              upc,
              icon,
            },
            originalItemId: itemId,
          })
        );
      }

      navigation.navigate("ItemDetails", { itemId: containerId });
    },
    [dispatch, navigation]
  );

  const fields = useMemo(() => {
    const emptyFields: FieldInfos[] = [
      { type: FieldType.icon, icon: item.icon },
      { type: FieldType.title, title: item.name },
      { type: FieldType.upc, upc: item.upc },
      { type: FieldType.isContainer, isContainer: item.type === "Container" },
      { type: FieldType.containerId, containerId: item.parentId },
      { type: FieldType.quantity, quantity: item.type === "Container" ? undefined : item.quantity },
    ];
    return new FieldInfoArgs(emptyFields);
  }, [item]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Form fields={fields} onDone={editItemCb} navigation={navigation} />
    </SafeAreaView>
  );
};
