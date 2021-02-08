import styled from "@emotion/native";
import React, { useContext } from "react";
import { View } from "react-native";
import { Icon, IconProps, Text, ThemeContext } from "react-native-elements";

interface Props {
  text: string;
  icon: IconProps;
  direction?: "row" | "column";
}
export const EmptyBasic = (props: Props) => {
  const { text, icon } = props;
  const { theme } = useContext(ThemeContext);
  return (
    <Container flexDirection={props.direction}>
      <Icon {...icon} reverse raised color={theme.colors.primary} />
      <Text>{text}</Text>
    </Container>
  );
};

const Container = styled(View)<{ flexDirection?: "row" | "column" }>((props) => ({
  justifyContent: "center",
  alignItems: "center",
  flexDirection: props.flexDirection ?? "column",
}));

const EmptyText = styled(Text)({});
