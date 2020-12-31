import React, { useCallback, useMemo, useState } from "react";
import { KeyboardAvoidingView, SafeAreaView, View } from "react-native";
import {
  Button,
  Divider as UIDivider,
  IndexPath,
  Input,
  Layout,
  Select,
  SelectItem,
  Text,
  Toggle,
} from "@ui-kitten/components";
import styled from "@emotion/native";
import NumericInput from "../../Components/NumberInput";
import { ScrollView } from "react-native-gesture-handler";
import { NavigatorProps, ScreenProps } from "../../Components/Navigation/Routes";
import { useAppDispatch } from "../../Store";
import { addItem, InventoryState } from "../../Store/inventory";
import { useSelector } from "react-redux";
import { ContainerItem, Item, State } from "../../Store/types";

const useInputState = (initialValue: string = "") => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};

const useNumberInputState = (initialValue: number = 1) => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChange: setValue };
};

const useBooleanInputState = (initialValue: boolean = false) => {
  const [checked, setValue] = React.useState(initialValue);
  return { checked, onChange: setValue };
};

const useSelectedIndexState = (initialValue: IndexPath | IndexPath[]) => {
  const [selectedIndex, setSelectedIndex] = React.useState(initialValue);
  return {
    selectedIndex,
    onSelect: (selectedIndex: IndexPath | IndexPath[]) => {
      console.log(selectedIndex);
      setSelectedIndex(selectedIndex);
    },
  };
};

interface Props extends ScreenProps<"AddItem"> {
  navigation: NavigatorProps<"AddItem">;
}

export const AddItemScreen = ({ route, navigation }: Props) => {
  const nameInputState = useInputState();
  const quantity = useNumberInputState();
  const upcInputState = useInputState();
  const isContainer = useBooleanInputState();
  const containers = useSelector<State, InventoryState["items"]>((state: State) => state.inventory.items);
  const [parentId, setParentId] = useState(route.params?.parentItemId || "");
  const parent = containers[parentId];

  const dispatch = useAppDispatch();
  const addItemCb = useCallback(() => {
    if (!isContainer.checked) {
      dispatch(
        addItem({
          newItem: {
            type: "NonContainer",
            name: nameInputState.value,
            quantity: quantity.value,
            upc: upcInputState.value.trim().length > 0 ? upcInputState.value.trim() : undefined,
          },
          parentId: parent.id,
        })
      );
    } else {
      dispatch(
        addItem({
          newItem: {
            type: "Container",
            name: nameInputState.value,
            upc: upcInputState.value.trim().length > 0 ? upcInputState.value.trim() : undefined,
          },
          parentId: parent.id,
        })
      );
    }

    navigation.navigate("ItemList", { itemId: parent.id });
  }, [dispatch, navigation, nameInputState, quantity, upcInputState]);

  const navigateSearch = () => {
    navigation.navigate("Search", {
      containersOnly: true,
      onTap: (item) => {
        setParentId(item.id);
        navigation.goBack();
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Layout style={{ flex: 1 }}>
          <KeyboardAvoidingView style={{ alignItems: "center" }}>
            <InputContainer>
              <Toggle {...isContainer}>Is this a container?</Toggle>
              <Text onPress={navigateSearch}>{parent.name || "Root"}</Text>
            </InputContainer>
            <Divider />
            <SimpleInput
              size="large"
              label="Name"
              placeholder="What is the name of the item or container?"
              {...nameInputState}
            />
            {!isContainer.checked && <NumericInput label="How many?" {...quantity} />}
            <SimpleInput
              size="medium"
              label="UPC (barcode)"
              placeholder="Optionally add a UPC for quick search"
              {...upcInputState}
            />
            <View style={{ flex: 0, marginVertical: 20 }}>
              <Button size="giant" onPress={addItemCb}>
                Add Item
              </Button>
            </View>
          </KeyboardAvoidingView>
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};

const InputContainer = styled(View)({
  marginVertical: 20,
});

const SimpleInput = styled(Input)({
  // marginVertical: 20,
  marginHorizontal: 20,
  flex: 1,
});

const Divider = styled(UIDivider)({ alignSelf: "stretch" });
