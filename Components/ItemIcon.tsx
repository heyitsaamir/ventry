import styled from "@emotion/native";
import React, { useContext } from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { Icon } from "react-native-elements";
import { useTheme } from "./Theme";

interface Props {
  icon?: string;
  isContainer: boolean;
  size: "sm" | "md" | "lg";
  style?: StyleProp<ViewStyle>;
}

export default function ItemIcon({ icon, size: propsSize, isContainer, style }: Props) {
  const { theme } = useTheme();
  const size = propsSize === "lg" ? 80 : propsSize === "md" ? 65 : 40;
  return (
    <IconContainer
      style={style}
      backgroundColor={theme.colors.grey5}
      borderColor={theme.colors.border}
      size={size}
    >
      {icon ? (
        <TextIcon size={size}>{icon}</TextIcon>
      ) : (
        <Icon
          size={size / 2}
          type={isContainer ? "font-awesome-5" : "octicon"}
          name={isContainer ? "box-open" : "screen-full"}
          color={theme.colors.black}
        />
      )}
      {isContainer && icon != null && icon !== "" && (
        <ContainerIcon>
          <Icon size={size / 3} type="font-awesome-5" name={"box-open"} color={theme.colors.black} />
        </ContainerIcon>
      )}
    </IconContainer>
  );
}

const IconContainer = styled(View)<{ backgroundColor: string; borderColor: string; size: number }>(
  ({ size, backgroundColor, borderColor }) => ({
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: size / 2,
    width: size,
    height: size,
    backgroundColor,
    borderColor,
    borderWidth: 1,
    shadowColor: "rgba(0,0,0, .4)",
  })
);

const TextIcon = styled(Text)<{ size: number }>((props) => ({
  textAlign: "center",
  fontSize: props.size * 0.6,
}));

const ContainerIcon = styled(View)({
  position: "absolute",
  bottom: 0,
  right: 0,
});
