import { StateWithHistory as UndoableState } from 'redux-undo';
import { V0State } from './v0';

type Id = string;

interface BaseItem {
  id: Id;
  name: string;
  createdAtUTC: string;
  upc?: string;
  icon?: string;
  parentId: string;
}

interface NonContainerItem extends BaseItem {
  type: 'NonContainer';
  quantity: number;
}

interface ContainerItem extends BaseItem {
  type: 'Container';
  itemsInside: Id[];
}

type Item = NonContainerItem | ContainerItem;

interface HistoryItem {
  id: string;
  itemId: string;
  summary: string[];
  createdAtUTC: string;
}

interface InventoryState {
  items: { [id: string]: Item }
  historyItems: { [id: string]: HistoryItem }
  historyIdByItemId: { [itemId: string]: string[] }
}

interface V1State {
  inventory: UndoableState<InventoryState>;
}

export const v1Migration = (state?: V0State & { _persist: any }): V1State & { _persist: any } => {
  return {
    ...state,
    inventory: {
      past: [],
      present: {
        items: {
          '': {
            type: 'Container',
            id: '',
            createdAtUTC: (new Date()).toUTCString(),
            name: 'Root',
            parentId: 'x',
            itemsInside: [],
          },
          ...state.inventory.present.items,
        },
        historyItems: {},
        historyIdByItemId: {},
      },
      future: []
    }
  }
}