import uuid from 'react-native-uuid';
import { ActionCreatorWithPayload, createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'
import { Item, ContainerItem, NonContainerItem } from './types';

export interface InventoryState {
  items: { [id: string]: Item }
}

type AddItemParams = { newItem: Omit<ContainerItem, "id" | "createdAtUTC" | "itemsInside" | "parentId"> | Omit<NonContainerItem, 'id' | 'createdAtUTC' | 'parentId'>, parentId: string };

export const inventorySlice = createSlice<InventoryState, SliceCaseReducers<InventoryState>>({
  name: 'inventory',
  initialState: {
    items: {
      '': {
        type: 'Container',
        id: '',
        createdAtUTC: (new Date()).toUTCString(),
        name: 'Root',
        parentId: 'x',
        itemsInside: ['kitchen-id'],
      },
      'kitchen-id': {
        type: 'Container',
        id: 'kitchen-id',
        createdAtUTC: (new Date()).toUTCString(),
        name: 'Kitchen',
        parentId: '',
        itemsInside: ['knives-id', 'spoons-id']
      },
      'knives-id': {
        type: 'NonContainer',
        id: 'knives-id',
        createdAtUTC: (new Date()).toUTCString(),
        name: 'Knives',
        parentId: 'kitchen-id',
        quantity: 4
      },
      'spoons-id': {
        type: 'NonContainer',
        id: 'spoons-id',
        createdAtUTC: (new Date()).toUTCString(),
        name: 'Spoons',
        parentId: 'kitchen-id',
        quantity: 4
      }
    },
  },
  reducers: {
    addItem: (state, action: PayloadAction<AddItemParams>) => {
      let itemToAdd: Item;
      const { parentId, newItem } = action.payload;
      if (newItem.type === 'Container') {
        const containerItem = newItem;
        itemToAdd = {
          ...containerItem,
          parentId,
          id: uuid.v4(),
          createdAtUTC: (new Date()).toUTCString(),
          itemsInside: [],
        };
      } else if (newItem.type === 'NonContainer') {
        const nonContainerItem = newItem;
        itemToAdd = {
          ...nonContainerItem,
          parentId,
          id: uuid.v4(),
          createdAtUTC: (new Date()).toUTCString(),
        };
      }
      const parent = state.items[action.payload.parentId];
      if (parent.type !== 'Container') throw new Error('The parent id is not a container!')
      const newParent: Item = {
        ...parent,
        itemsInside: parent.itemsInside.concat(itemToAdd.id)
      }
      return {
        ...state,
        items: {
          ...state.items,
          [itemToAdd.id]: itemToAdd,
          [parent.id]: newParent,
        }
      }
    }
  }
})

const { addItem: addItemFn } = inventorySlice.actions

export default inventorySlice.reducer;
export const addItem: ActionCreatorWithPayload<AddItemParams> = addItemFn;