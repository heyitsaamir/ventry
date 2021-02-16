import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native";
import { NavigatorProps, ScreenProps } from "../../Components/Navigation/Routes";
import { useAppDispatch } from "../../Store";
import { addItem } from "../../Store/inventory";
import Form, { FieldType, FieldInfos, FieldInfoArgs, FormRef } from "./form";
import Toast from "react-native-toast-message";
import { useSettableCallback } from "../../lib/hooks/useSettableCallback";
import { AlertModal } from "../../Components/AlertModal";

interface Props extends ScreenProps<"AddItem"> {
  navigation: NavigatorProps<"AddItem">;
}

export const AddItemScreen = ({ route, navigation }: Props) => {
  let isSaved = false;
  const [parentId] = useState(route.params?.parentItemId || "");
  const [visibleModalType, setVisibleModal] = useState<"Unsaved Changes" | undefined>(undefined);
  const [discardCB, setDiscardCB] = useSettableCallback<() => void | undefined>(undefined);

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
        isSaved = true;
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
      { type: FieldType.containerId, containerId: parentId, itemId: undefined },
      { type: FieldType.quantity },
    ];
    return new FieldInfoArgs(emptyFields);
  }, [parentId]);

  const ref = useRef<FormRef>();

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!isSaved && ref.current?.isModified()) {
        e.preventDefault();
        setDiscardCB(() => navigation.dispatch(e.data?.action));
        setVisibleModal("Unsaved Changes");
      }
    });

    return unsubscribe;
  }, [navigation, ref, setVisibleModal]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Form ref={ref} fields={fields} onDone={addItemCb} navigation={navigation} />
      <AlertModal
        isVisible={visibleModalType === "Unsaved Changes"}
        title={`Discard changes?`}
        text="You have some unsaved changes. Do you want to discard them?"
        reverse
        confirmButton={{
          text: "Stay",
          onPress: () => {
            setVisibleModal(undefined);
            setDiscardCB(undefined);
          },
        }}
        cancelButton={{
          text: "Discard",
          onPress: () => {
            setVisibleModal(undefined);
            if (discardCB) {
              discardCB();
              setDiscardCB(undefined);
            } else {
              navigation.goBack();
            }
          },
        }}
      />
    </SafeAreaView>
  );
};
