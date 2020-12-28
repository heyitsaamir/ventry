import React from "react";
import { SafeAreaView, View } from "react-native";
import { Button, Input, Layout, Text } from "@ui-kitten/components";
import styled from "@emotion/native";
import NumericInput from "../../Components/NumberInput";
import { ScrollView } from "react-native-gesture-handler";

const useInputState = (initialValue: string = "") => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};

const useNumberInputState = (initialValue: number = 1) => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChange: setValue };
};

export const AddItemScreen = () => {
  const nameInputState = useInputState();
  const quantity = useNumberInputState();
  const isbnInputState = useInputState();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1, alignItems: "center" }}>
        <ScrollView>
          <View style={{ flex: 1, alignItems: "center" }}>
            <SimpleInput
              size="large"
              label="Name"
              placeholder="What is the name of the item or container?"
              {...nameInputState}
            />
            <NumericInput label="How many?" {...quantity} />
            <SimpleInput
              size="medium"
              label="UPC (barcode)"
              placeholder="Optionally add a UPC for quick search"
              {...isbnInputState}
            />
          </View>
        </ScrollView>
        <View style={{ flex: 0, marginVertical: 20 }}>
          <Button size="giant">Add Item</Button>
        </View>
      </Layout>
    </SafeAreaView>
  );
};

const SimpleInput = styled(Input)({
  marginVertical: 20,
  marginHorizontal: 20,
});
