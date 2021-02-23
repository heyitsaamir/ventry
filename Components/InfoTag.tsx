import styled from "@emotion/native";
import React, { useContext } from "react";
import { Text } from "react-native";
import { ThemeProps, useTheme } from "./Theme";

interface Props {
  info: string;
}

const InfoTag = (props: Props) => {
  const { theme } = useTheme();
  return <Container theme={theme}>{props.info}</Container>;
};

const Container = styled(Text)<ThemeProps>((props) => ({
  padding: 5,
  borderRadius: 5,
  borderColor: props.theme.colors.greyOutline,
  borderWidth: 1,
  flexShrink: 1,
  flexGrow: 0,
  marginHorizontal: 2,
}));

export default InfoTag;
