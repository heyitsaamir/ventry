import { InventoryState } from './inventory';
import { StateWithHistory as UndoableState } from 'redux-undo';

export interface State {
  inventory: UndoableState<InventoryState>
}

export type Id = string;

interface BaseItem {
  id: Id;
  name: string;
  createdAtUTC: string;
  upc?: string;
  icon?: string;
  parentId: string;
}

export interface NonContainerItem extends BaseItem {
  type: 'NonContainer';
  quantity: number;
}

export interface ContainerItem extends BaseItem {
  type: 'Container';
  itemsInside: Id[];
}

export type Item = NonContainerItem | ContainerItem;

export type QuantitySummary = { type: 'quantity', startQuantity: number; endQuantity: number }
export type Summary = string | QuantitySummary

export interface HistoryItem {
  id: string;
  itemId: string;
  summary: Summary[];
  createdAtUTC: string;
}