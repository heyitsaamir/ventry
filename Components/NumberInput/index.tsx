import { Text } from "react-native-elements";
import React from "react";
import { View } from "react-native";
import InputSpinner from "react-native-input-spinner";
import { useTheme } from "../Theme";

interface Props {
  label?: string;
  disabled?: boolean;
  value: number | undefined;
  onChange: (number: number) => void;
}

const NumberInputWrapper = (props: Props) => {
  const { label, ...restProps } = props;
  const { theme } = useTheme();

  return (
    <View>
      {label && <Text>{label}</Text>}
      <InputSpinner color={theme.colors.secondary} {...restProps} />
    </View>
  );
};

export default NumberInputWrapper;
