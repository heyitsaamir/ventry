import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, SafeAreaView, Switch, View } from "react-native";
import styled from "@emotion/native";
import NumericInput from "../../Components/NumberInput";
import { ScrollView } from "react-native-gesture-handler";
import { NavigatorProps, ScreenProps } from "../../Components/Navigation/Routes";
import { useAppDispatch } from "../../Store";
import { addItem, InventoryState } from "../../Store/inventory";
import { useSelector } from "react-redux";
import { ContainerItem, Item, State } from "../../Store/types";
import { Input, ListItem, Icon, Text, Button, ThemeContext } from "react-native-elements";
import { SearchContext } from "../../Components/Navigation/searchContext";

const useInputState = (initialValue: string = "") => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};

const useNumberInputState = (initialValue: number = 1) => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChange: setValue };
};

const useBooleanInputState = (initialValue: boolean = false) => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onValueChange: setValue };
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
  const searchContext = useContext(SearchContext);
  const parent = containers[parentId];

  const dispatch = useAppDispatch();
  const addItemCb = useCallback(() => {
    if (!isContainer.value) {
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
    searchContext.setOnItemTap((item) => {
      setParentId(item.id);
      navigation.goBack();
    });

    navigation.navigate("Search", {
      containersOnly: true,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <InputContainer label="Container info">
          <ListItem>
            <ListItem.Content>
              <ListItem.Title>Is this a container?</ListItem.Title>
            </ListItem.Content>
            <Switch {...isContainer} />
          </ListItem>
          <ListItem onPress={navigateSearch}>
            <ListItem.Content>
              <ListItem.Title>Where is this item contained?</ListItem.Title>
            </ListItem.Content>
            <ListItem.Title>{parent.name || "Root"}</ListItem.Title>
            <ListItem.Chevron />
          </ListItem>
        </InputContainer>
        <InputContainer label="Item info">
          <ListItem>
            <ListItem.Title>Name</ListItem.Title>
            <ListItem.Content>
              <ListItem.Input placeholder="of the item" {...nameInputState} />
            </ListItem.Content>
          </ListItem>
          {!isContainer.value && (
            <ListItem>
              <ListItem.Content>
                <ListItem.Title>How many?</ListItem.Title>
              </ListItem.Content>
              <NumericInput {...quantity} />
            </ListItem>
          )}
          <ListItem>
            <ListItem.Title>UPC</ListItem.Title>
            <ListItem.Content>
              <ListItem.Input placeholder="Optionally add a UPC for quick search" {...upcInputState} />
            </ListItem.Content>
          </ListItem>
        </InputContainer>
        <View style={{ flex: 0, marginVertical: 20 }}>
          <Button onPress={addItemCb} title="Add Item" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InputContainer = ({ label, children }: { label: string; children: React.ReactNode }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <View>
      <View
        style={{ backgroundColor: theme.colors.grey5, height: 50, justifyContent: "flex-end", padding: 10 }}
      >
        <Text style={{ fontSize: 16 }}>{label}</Text>
      </View>
      {children}
    </View>
  );
};

const SimpleInput = styled(Input)({
  // marginVertical: 20,
  marginHorizontal: 20,
  flex: 1,
});

const Divider = styled(View)({ alignSelf: "stretch" });
