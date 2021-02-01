import React, { useCallback, useMemo, useState } from "react";
import { SafeAreaView } from "react-native";
import { NavigatorProps, ScreenProps } from "../../Components/Navigation/Routes";
import { useAppDispatch } from "../../Store";
import { addItem } from "../../Store/inventory";
import Form, { FieldType, FieldInfos, FieldInfoArgs } from "./form";
import Toast from "react-native-toast-message";

interface Props extends ScreenProps<"AddItem"> {
  navigation: NavigatorProps<"AddItem">;
}

export const AddItemScreen = ({ route, navigation }: Props) => {
  const [parentId] = useState(route.params?.parentItemId || "");

  const dispatch = useAppDispatch();
  const addItemCb = useCallback(
    (fieldInfos: FieldInfoArgs) => {
      try {
        const isContainer = fieldInfos.get(FieldType.isContainer)?.isContainer;
        const name = fieldInfos.get(FieldType.title)?.title;
        const quantity = fieldInfos.get(FieldType.quantity)?.quantity;
        const upc = fieldInfos.get(FieldType.upc)?.upc;
        const icon = fieldInfos.get(FieldType.icon)?.icon;
        const containerId = fieldInfos.get(FieldType.containerId)?.containerId;
        if (!isContainer) {
          dispatch(
            addItem({
              newItem: {
                type: "NonContainer",
                name,
                quantity,
                upc,
                icon,
              },
              parentId: containerId,
            })
          );
        } else {
          dispatch(
            addItem({
              newItem: {
                type: "Container",
                name,
                upc,
                icon,
              },
              parentId: containerId,
            })
          );
        }

        navigation.navigate("ItemDetails", { itemId: containerId });
      } catch (error) {
        Toast.show({
          text1: `Error`,
          text2: error.message,
          type: "error",
          position: "bottom",
        });
      }
    },
    [dispatch, navigation]
  );

  const fields = useMemo(() => {
    const emptyFields: FieldInfos[] = [
      { type: FieldType.icon },
      { type: FieldType.title },
      { type: FieldType.upc },
      { type: FieldType.isContainer },
      { type: FieldType.containerId, containerId: parentId },
      { type: FieldType.quantity },
    ];
    return new FieldInfoArgs(emptyFields);
  }, [parentId]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Form fields={fields} onDone={addItemCb} navigation={navigation} />
    </SafeAreaView>
  );
};
