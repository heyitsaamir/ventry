import styled from "@emotion/native";
import React, { useContext } from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { ThemeContext, Icon } from "react-native-elements";

interface Props {
  icon?: string;
  isContainer: boolean;
  size: "sm" | "md" | "lg";
  style?: StyleProp<ViewStyle>;
}

export default function ItemIcon({ icon, size: propsSize, isContainer, style }: Props) {
  const { theme } = useContext(ThemeContext);
  const size = propsSize === "lg" ? 80 : propsSize === "md" ? 60 : 40;
  return (
    <IconContainer style={style} backgroundColor={theme.colors.grey5} size={size}>
      {icon ? (
        <TextIcon>{icon}</TextIcon>
      ) : (
        <Icon
          size={size / 2}
          type="font-awesome-5"
          name={isContainer ? "box-open" : "lemon"}
          color={theme.colors.black}
        />
      )}
      {isContainer && icon != null && (
        <ContainerIcon>
          <Icon size={size / 4} type="font-awesome-5" name={"box-open"} color={theme.colors.black} />
        </ContainerIcon>
      )}
    </IconContainer>
  );
}

const IconContainer = styled(View)<{ backgroundColor: string; size: number }>(
  ({ size, backgroundColor }) => ({
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: size / 2,
    width: size,
    height: size,
    backgroundColor: backgroundColor,
    shadowColor: "rgba(0,0,0, .4)",
  })
);

const TextIcon = styled(Text)({
  textAlign: "center",
  fontSize: 20,
});

const ContainerIcon = styled(View)({
  position: "absolute",
  bottom: 0,
  right: 0,
});
