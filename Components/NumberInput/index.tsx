// import { Text, ThemedComponentProps, withStyles } from "@ui-kitten/components";
import styled from "@emotion/native";
import { Text } from "react-native-elements";
import React from "react";
import { View } from "react-native";
import NumericInput, { INumericInputProps } from "react-native-numeric-input";

interface Props {
  label?: string;
}

const NumberInputWrapper = (props: Props & INumericInputProps) => {
  const { label } = props;

  return (
    <View>
      {label && <Text>{label}</Text>}
      <NumberInputContainer>
        <NumericInput
          rounded
          totalWidth={240}
          totalHeight={40}
          // textColor={platform.textColor}
          // iconStyle={{ color: platform.textColor as string }}
          {...props}
        />
      </NumberInputContainer>
    </View>
  );
};

const NumberInputContainer = styled(View)({
  // width: "100%",
  // flexDirection: "row",
  // height: 55,
  // justifyContent: "flex-start",
  // alignItems: "center",
});

// const ThemedNumberInputWrapper = withStyles(NumberInputWrapper);

export default NumberInputWrapper;
