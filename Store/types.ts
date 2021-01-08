import { InventoryState } from './inventory';

export interface State {
  inventory: InventoryState
}

export type Id = string;

interface BaseItem {
  id: Id;
  name: string;
  createdAtUTC: string;
  upc?: string;
  icon?: string;
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