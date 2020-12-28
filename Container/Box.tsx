import * as React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import styled, { css } from "@emotion/native";

interface ContainerProps {
  screenWidth: number;
  itemsPerRow: number;
}

const Container = styled.View<ContainerProps>`
  padding: 10px;
  width: ${(props) => props.screenWidth / props.itemsPerRow};
  height: 250px;
`;

const Box = styled.View`
  display: flex;
  border: 1px solid #aaa;
  border-radius: 10px;
  flex: 1;
`;

interface Props extends ContainerProps {
  children: React.ReactNode;
}

const BoxContainer = (props: Props) => {
  return (
    <Container {...props}>
      <Box>{props.children}</Box>
    </Container>
  );
};

export default BoxContainer;
