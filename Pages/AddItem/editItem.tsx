import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native";
import { Text } from "react-native-elements";
import { useSelector } from "react-redux";
import { AlertModal } from "../../Components/AlertModal";
import { removeItemFromNavStack } from "../../Components/Navigation/customActions/removeItemFromNavStack";
import { NavigatorProps, ScreenProps } from "../../Components/Navigation/Routes";
import useCustomNav, { RightNavButtonOptions } from "../../Components/Navigation/useCustonNav";
import { useAppDispatch } from "../../Store";
import { editItem, deleteItem } from "../../Store/inventory";
import { Item, State } from "../../Store/types";
import Form, { FieldType, FieldInfos, FieldInfoArgs, FormRef } from "./form";
import Toast from "react-native-toast-message";
import { ActionCreators } from "redux-undo";
import { IsContainer } from "../../lib/modelUtilities/itemUtils";
import { useSettableCallback } from "../../lib/hooks/useSettableCallback";

interface Props extends ScreenProps<"EditItem"> {
  navigation: NavigatorProps<"EditItem">;
}

export const EditItemScreen = ({ route, ...restProps }: Props) => {
  const itemId = route.params!.itemId!;
  const item = useSelector<State, Item>((state: State) => state.inventory.present.items[itemId]);
  return item ? <EditItem item={item} {...restProps} /> : <Text>Does not exist</Text>;
};

const EditItem = ({ item, navigation }: { item: Item; navigation: NavigatorProps<"EditItem"> }) => {
  let isSaved = false;
  const [visibleModalType, setVisibleModal] = useState<"Delete" | "Unsaved Changes" | undefined>(undefined);
  const [discardCB, setDiscardCB] = useSettableCallback<() => void | undefined>(undefined);
  const dispatch = useAppDispatch();
  const editItemCb = useCallback(
    (fieldInfos: FieldInfoArgs) => {
      try {
        if (!item) return;
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
                parentId: containerId,
              },
              itemId: item.id,
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
                parentId: containerId,
              },
              itemId: item.id,
            })
          );
        }
        isSaved = true;
        navigation.goBack();
      } catch (error) {
        Toast.show({
          text1: `Error`,
          text2: error.message,
          type: "error",
          position: "bottom",
        });
      }
    },
    [dispatch, item, navigation]
  );
  const deleteItemCb = useCallback(() => {
    try {
      dispatch(deleteItem({ itemId: item.id }));
      Toast.show({
        text1: `${item.name} deleted`,
        text2: "Tap to undo",
        type: "success",
        position: "bottom",
        onPress: () => {
          dispatch(ActionCreators.undo());
          Toast.hide();
        },
      });
      navigation.dispatch(removeItemFromNavStack(item.id));
    } catch (error) {
      Toast.show({
        text1: `Error`,
        text2: error.message,
        type: "error",
        position: "bottom",
      });
    }
  }, [dispatch, item, navigation]);

  const navButtons = useMemo(() => {
    const navButtons: RightNavButtonOptions[] = [];
    navButtons.push({
      name: "delete",
      type: "material",
      onPress: () => setModalVisible(true),
    });
    return navButtons;
  }, [item, navigation]);

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
  useCustomNav({
    title: `Edit ${item.name}`,
    rightButtons: navButtons,
  });

  const fields = useMemo(() => {
    const emptyFields: FieldInfos[] = [];
    if (!item) return null;
    if (item.id !== "") {
      emptyFields.push(
        { type: FieldType.containerId, containerId: item.parentId, itemId: item.id },
        {
          type: FieldType.quantity,
          quantity: IsContainer(item) ? undefined : item.quantity,
        },
        { type: FieldType.upc, upc: item.upc },
        {
          type: FieldType.isContainer,
          isContainer: IsContainer(item),
          disabled: IsContainer(item) && item.itemsInside.length > 0,
          comment:
            IsContainer(item) && item.itemsInside.length > 0
              ? "This item contains stuff. It cannot be converted into a non-container"
              : undefined,
        }
      );
    }
    emptyFields.push({ type: FieldType.icon, icon: item.icon }, { type: FieldType.title, title: item.name });
    return new FieldInfoArgs(emptyFields);
  }, [item]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {fields == null ? null : <Form ref={ref} fields={fields} onDone={editItemCb} navigation={navigation} />}
      <AlertModal
        isVisible={visibleModalType === "Delete"}
        title={`Delete ${item.name}?`}
        text="Are you sure?"
        reverse
        confirmButton={{
          text: "Yes",
          onPress: () => {
            setVisibleModal(undefined);
            deleteItemCb();
          },
        }}
        cancelButton={{
          text: "No",
          onPress: () => {
            setVisibleModal(undefined);
          },
        }}
      />
      <AlertModal
        isVisible={visibleModalType === "Unsaved Changes"}
        title={`Discard changes?`}
        text="You have some unsaved changes. Do you want to discard them?"
        reverse
        confirmButton={{
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
        cancelButton={{
          text: "Stay",
          onPress: () => {
            setVisibleModal(undefined);
            setDiscardCB(undefined);
          },
        }}
      />
    </SafeAreaView>
  );
};
