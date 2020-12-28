import { Text, ThemedComponentProps, withStyles } from "@ui-kitten/components";
import React from "react";
import { View } from "react-native";
import NumericInput, { INumericInputProps } from "react-native-numeric-input";

interface Props {
  label?: string;
}

const NumberInputWrapper = (props: Props & INumericInputProps & ThemedComponentProps) => {
  const { eva, label } = props;

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      {label && (
        <Text style={{ marginVertical: 5 }} category="label" appearance="hint">
          {label}
        </Text>
      )}
      <NumericInput
        rounded
        totalWidth={240}
        totalHeight={50}
        borderColor={eva.theme?.["border-alterantive-color-1"]}
        leftButtonBackgroundColor={eva.theme?.["background-basic-color-1"]}
        rightButtonBackgroundColor={eva.theme?.["background-basic-color-1"]}
        textColor={eva.theme?.["text-basic-color"]}
        iconStyle={{ color: eva.theme?.["text-basic-color"] }}
        {...props}
      />
    </View>
  );
};

const ThemedNumberInputWrapper = withStyles(NumberInputWrapper);

export default ThemedNumberInputWrapper;
