import React from "react";
import { Dimensions, View } from "react-native";
import styled from "@emotion/native";
import { useHeaderHeight } from "@react-navigation/stack";

interface Props {
  extraPadding?: number;
  height?: number;
  children: React.ReactNode;
}

export default function ModalContainer(props: Props) {
  const headerHeight = useHeaderHeight();
  const { height: windowHeight } = Dimensions.get("window");
  return (
    <ModalWrapper>
      <Container
        height={props.height ?? windowHeight}
        extraPadding={props.extraPadding}
        navHeight={headerHeight}
      >
        {props.children}
      </Container>
    </ModalWrapper>
  );
}

const ModalWrapper = styled(View)({
  backgroundColor: "#00000077",
});

const Container = styled(View)<{
  height?: number;
  extraPadding: number;
  navHeight: number;
}>((props) => ({
  top: props.navHeight + props.extraPadding,
  height: props.height,
  width: "100%",
}));
