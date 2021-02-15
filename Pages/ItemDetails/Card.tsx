import styled from "@emotion/native";
import React, { useContext } from "react";
import { View } from "react-native";
import { Text, TextProps, Theme, ThemeContext } from "react-native-elements";
import { IsNonContainer } from "../../lib/modelUtilities/itemUtils";
import { Item } from "../../Store/types";
import { theme } from "../../Theme/theme";

interface Props {
  item: Item;
}

export const ItemCard = (props: Props) => {
  return (
    <Container>
      {IsNonContainer(props.item) ? (
        <>
          <SingleItem title="Quantity" value={`${props.item.quantity}`} />
          <SingleItem title="UPC / barcode" value={`${props.item.upc}`} />
        </>
      ) : null}
    </Container>
  );
};

const Container = styled(View)({ padding: 10 });

const SingleItem = ({ title, value }: { title: string; value?: string }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <SingleItemContainer theme={theme}>
      <Title>{title}</Title>
      {!!value ? <Text>{value}</Text> : <NoValueText theme={theme}>No value set</NoValueText>}
    </SingleItemContainer>
  );
};

const Title = styled(Text)({ flex: 1, fontSize: 15, fontWeight: "600" });
const NoValueText = styled(Text)<{ theme: Theme }>({ color: theme.colors.text, opacity: 0.5 });
const SingleItemContainer = styled(View)<{ theme: Theme }>((props) => ({
  flexDirection: "row",
  marginVertical: 5,
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderColor: props.theme.colors.border,
}));
