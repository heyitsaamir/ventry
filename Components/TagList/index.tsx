import styled from "@emotion/native";
import React from "react";
import { View } from "react-native";
import { Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

interface Tag {
  id: string;
  value: string;
}
interface Props {
  tags: Tag[];
  onTap?: (tag: Tag) => void;
}

const TagList = ({ tags, onTap }: Props) => {
  return (
    <Container horizontal>
      {tags.map((tag) => (
        <Tag type="outline" key={`TagList-index-${tag.id}`} onPress={() => onTap(tag)} title={tag.value} />
      ))}
    </Container>
  );
};

const Container = styled(ScrollView)({
  flexWrap: "wrap",
  flexDirection: "row",
});

const Tag = styled(Button)({ margin: 5 });

export default TagList;
