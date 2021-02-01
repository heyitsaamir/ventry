import React, { useCallback, useMemo, useState } from "react";
import { SafeAreaView } from "react-native";
import { Text } from "react-native-elements";
import { useSelector } from "react-redux";
import { AlertModal } from "../../Components/AlertModal";
import { removeItemFromNavStack } from "../../Components/Navigation/customActions/removeItemFromNavStack";
import { NavigatorProps, ScreenProps } from "../../Components/Navigation/Routes";
import useCustomNav, { RightNavButton } from "../../Components/Navigation/useCustonNav";
import { useAppDispatch } from "../../Store";
import { editItem, deleteItem } from "../../Store/inventory";
import { Item, State } from "../../Store/types";
import Form, { FieldType, FieldInfos, FieldInfoArgs } from "./form";
import Toast from "react-native-toast-message";
import { ActionCreators } from "redux-undo";

interface Props extends ScreenProps<"EditItem"> {
  navigation: NavigatorProps<"EditItem">;
}

export const EditItemScreen = ({ route, ...restProps }: Props) => {
  const itemId = route.params!.itemId!;
  const item = useSelector<State, Item>((state: State) => state.inventory.present.items[itemId]);
  return item ? <EditItem item={item} {...restProps} /> : <Text>Does not exist</Text>;
};

const EditItem = ({ item, navigation }: { item: Item; navigation: NavigatorProps<"EditItem"> }) => {
  const [isModalVisible, setModalVisible] = useState(false);

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
    const navButtons: RightNavButton[] = [];
    navButtons.push({
      name: "delete",
      type: "material",
      onPress: () => setModalVisible(true),
    });
    return navButtons;
  }, [item, navigation]);
  useCustomNav({
    title: `Edit ${item.name}`,
    rightButtons: navButtons,
  });

  const fields = useMemo(() => {
    const emptyFields: FieldInfos[] = [];
    if (!item) return null;
    if (item.id !== "") {
      emptyFields.push(
        { type: FieldType.containerId, containerId: item.parentId },
        {
          type: FieldType.quantity,
          quantity: item.type === "Container" ? undefined : item.quantity,
        },
        { type: FieldType.upc, upc: item.upc },
        {
          type: FieldType.isContainer,
          isContainer: item.type === "Container",
          disabled: item.type === "Container" && item.itemsInside.length > 0,
          comment:
            item.type === "Container" && item.itemsInside.length > 0
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
      {fields == null ? null : <Form fields={fields} onDone={editItemCb} navigation={navigation} />}
      <AlertModal
        isVisible={isModalVisible}
        title={`Delete ${item.name}?`}
        text="Are you sure?"
        reverse
        confirmButton={{
          text: "Yes",
          onPress: () => {
            setModalVisible(false);
            deleteItemCb();
          },
        }}
        cancelButton={{
          text: "No",
          onPress: () => {
            setModalVisible(false);
          },
        }}
      />
    </SafeAreaView>
  );
};
