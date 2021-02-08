import React from "react";
import { HistoryItem, State } from "../../Store/types";
import { useSelector } from "react-redux";
import { ListItem } from "react-native-elements";
import dateFormat from "dateformat";
import styled from "@emotion/native";

interface Props {
  historyItemId: string;
}

const getHistoryText = (historyItem: HistoryItem) => {
  if (historyItem.summary.length === 1) {
    const [firstSummary] = historyItem.summary;
    if (typeof firstSummary !== "string" && firstSummary.type === "quantity") {
      return `Changed quantity from ${firstSummary.startQuantity} to ${firstSummary.endQuantity}`;
    }
  }
  return historyItem.summary.join(", ");
};

export const HistoryItemCard = ({ historyItemId }: Props) => {
  const historyItem = useSelector<State, HistoryItem>(
    (state) => state.inventory.present.historyItems[historyItemId]
  );

  return (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{getHistoryText(historyItem)}</ListItem.Title>
        <Subtitle>{dateFormat(historyItem.createdAtUTC, "mmm dS yyyy @ h:MM TT")}</Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

const Subtitle = styled(ListItem.Subtitle)({ fontStyle: "italic" });
