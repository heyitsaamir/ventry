import styled from "@emotion/native";
import React, { useContext } from "react";
import { View } from "react-native";
import Modal, { ModalProps } from "react-native-modal";
import { Button, Text, Theme, ThemeContext } from "react-native-elements";

interface ButtonProps {
  text: string;
  onPress: () => void;
}

interface Props {
  isVisible: boolean;
  title?: string;
  text: string;
  confirmButton: ButtonProps;
  cancelButton?: ButtonProps;
  reverse?: boolean;
}

export const AlertModal = (props: Props) => {
  const { theme } = useContext(ThemeContext);
  return (
    <Modal animationIn="bounceInUp" animationInTiming={500} isVisible={props.isVisible}>
      <AlertContainer theme={theme}>
        {props.title && <StyledText h4>{props.title}</StyledText>}
        <StyledText>{props.text}</StyledText>
        <ButtonContainer reverse={props.reverse}>
          {props.cancelButton && (
            <StyledButton
              type="outline"
              containerStyle={{ flex: 1 }}
              title={props.cancelButton.text}
              onPress={props.cancelButton.onPress}
            />
          )}
          <StyledButton
            containerStyle={{ flex: 1 }}
            title={props.confirmButton.text}
            onPress={props.confirmButton.onPress}
          />
        </ButtonContainer>
      </AlertContainer>
    </Modal>
  );
};

const AlertContainer = styled(View)<{ theme: Theme }>(({ theme }) => ({
  display: "flex",
  borderWidth: 1,
  backgroundColor: theme.colors.white,
  position: "absolute",
  width: "100%",
  bottom: 50,
  padding: 5,
}));

const StyledText = styled(Text)({
  margin: 5,
});

const ButtonContainer = styled(View)<{ reverse?: boolean }>((props) => ({
  display: "flex",
  flexDirection: props.reverse ? "row-reverse" : "row",
  justifyContent: "center",
}));

const StyledButton = styled(Button)({
  flex: 1,
  margin: 5,
});
