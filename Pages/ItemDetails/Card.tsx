import styled from "@emotion/native";
import React, { useContext } from "react";
import { View } from "react-native";
import { Text, TextProps, Theme, ThemeContext } from "react-native-elements";
import { IsNonContainer } from "../../lib/modelUtilities/itemUtils";
import { Item } from "../../Store/types";

interface Props {
  item: Item;
}

export const ItemCard = (props: Props) => {
  return (
    <Container>
      {IsNonContainer(props.item) ? (
        <>
          <SingleItem title="Quantity" value={`${props.item.quantity}`} />
          {props.item.upc && <SingleItem title="UPC / barcode" value={`${props.item.upc}`} />}
        </>
      ) : null}
    </Container>
  );
};

const Container = styled(View)({ padding: 10 });

const SingleItem = ({ title, value }: { title: string; value: string }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <SingleItemContainer theme={theme}>
      <Title>{title}</Title>
      <Text>{value}</Text>
    </SingleItemContainer>
  );
};

const Title = styled(Text)({ flex: 1, fontSize: 15, fontWeight: "600" });
const SingleItemContainer = styled(View)<{ theme: Theme }>((props) => ({
  flexDirection: "row",
  marginVertical: 5,
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderColor: props.theme.colors.border,
}));
