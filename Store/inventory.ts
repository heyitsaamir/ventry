import uuid from 'react-native-uuid';
import { ActionCreatorWithPayload, createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'
import { Item, ContainerItem, NonContainerItem } from './types';

export interface InventoryState {
  items: { [id: string]: Item }
}

type AddItemParams = { newItem: Omit<ContainerItem, "id" | "createdAtUTC" | "itemsInside"> | Omit<NonContainerItem, 'id' | 'createdAtUTC'>, parentId: string };

export const inventorySlice = createSlice<InventoryState, SliceCaseReducers<InventoryState>>({
  name: 'inventory',
  initialState: {
    items: {
      '': {
        type: 'Container',
        id: '',
        createdAtUTC: (new Date()).toUTCString(),
        name: 'Root',
        itemsInside: ['kitchen-id'],
      },
      'kitchen-id': {
        type: 'Container',
        id: 'kitchen-id',
        createdAtUTC: (new Date()).toUTCString(),
        name: 'Kitchen',
        itemsInside: ['knives-id', 'spoons-id']
      },
      'knives-id': {
        type: 'NonContainer',
        id: 'knives-id',
        createdAtUTC: (new Date()).toUTCString(),
        name: 'Knives',
        quantity: 4
      },
      'spoons-id': {
        type: 'NonContainer',
        id: 'spoons-id',
        createdAtUTC: (new Date()).toUTCString(),
        name: 'Spoons',
        quantity: 4
      }
    },
  },
  reducers: {
    addItem: (state, action: PayloadAction<AddItemParams>) => {
      let itemToAdd: Item;
      if (action.payload.newItem.type === 'Container') {
        const containerItem = action.payload.newItem as Omit<ContainerItem, "id" | "createdAt">;
        itemToAdd = {
          ...containerItem,
          id: uuid.v4(),
          createdAtUTC: (new Date()).toUTCString(),
          itemsInside: [],
        };
      } else if (action.payload.newItem.type === 'NonContainer') {
        const nonContainerItem = action.payload.newItem as Omit<NonContainerItem, "id" | "createdAt">;
        itemToAdd = {
          ...nonContainerItem,
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