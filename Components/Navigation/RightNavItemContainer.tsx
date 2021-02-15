import styled from "@emotion/native";
import React from "react";
import { View } from "react-native";
import { Icon, IconProps } from "react-native-elements";

export const RightNavItemContainer = styled(View)({
  flexDirection: "row",
  marginRight: 10,
});

export const NavIcon = (props: IconProps) => <Icon {...props} containerStyle={{ marginHorizontal: 5 }} />;
