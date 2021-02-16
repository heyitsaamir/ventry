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
    <Modal animationIn="bounceInUp" animationInTiming={800} isVisible={props.isVisible}>
      <AlertContainer theme={theme}>
        {props.title && <Text h4>{props.title}</Text>}
        <StyledText>{props.text}</StyledText>
        <ButtonContainer reverse={props.reverse}>
          {props.cancelButton && (
            <>
              <Button
                type="outline"
                containerStyle={{ flex: 1 }}
                title={props.cancelButton.text}
                onPress={props.cancelButton.onPress}
              />
              <Spacer />
            </>
          )}
          <Button
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
  padding: 10,
  borderRadius: 5,
}));

const StyledText = styled(Text)({
  marginTop: 10,
  marginBottom: 15,
});

const ButtonContainer = styled(View)<{ reverse?: boolean }>((props) => ({
  display: "flex",
  flexDirection: props.reverse ? "row-reverse" : "row",
  justifyContent: "center",
  alignItems: "center",
}));

const Spacer = styled(View)({ width: 10, flex: 0 });
