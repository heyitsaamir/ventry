import { Text, ThemeContext } from "react-native-elements";
import React, { useContext } from "react";
import { View } from "react-native";
import InputSpinner from "react-native-input-spinner";

interface Props {
  label?: string;
  disabled?: boolean;
  value: number;
  onChange: (number) => void;
}

const NumberInputWrapper = (props: Props) => {
  const { label, ...restProps } = props;
  const { theme } = useContext(ThemeContext);

  return (
    <View>
      {label && <Text>{label}</Text>}
      <InputSpinner color={theme.colors.secondary} {...restProps} />
    </View>
  );
};

export default NumberInputWrapper;
