import uuid from 'react-native-uuid';
import { ActionCreatorWithPayload, createReducer, createSlice, PayloadAction, SliceCaseReducers, } from '@reduxjs/toolkit'
import { Item, ContainerItem, NonContainerItem } from './types';

export interface InventoryState {
  items: { [id: string]: Item }
}

type AddItemParams = { newItem: Omit<ContainerItem, "id" | "createdAtUTC" | "itemsInside" | "parentId"> | Omit<NonContainerItem, 'id' | 'createdAtUTC' | 'parentId'>, parentId: string };
type EditItemParams = { itemId: string, updatedItem: Omit<ContainerItem, "id" | "createdAtUTC" | "itemsInside"> | Omit<NonContainerItem, 'id' | 'createdAtUTC'> };

const initialState: InventoryState = {
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
  }
};

export const inventorySlice = createSlice<InventoryState, SliceCaseReducers<InventoryState>>({
  name: 'inventory',
  initialState,
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
      parent.itemsInside = parent.itemsInside.concat(itemToAdd.id);
      state.items[itemToAdd.id] = itemToAdd;
    },
    editItem: (state, action: PayloadAction<EditItemParams>) => {
      const { itemId, updatedItem } = action.payload;
      const originalItem = state.items[itemId];
      if (!originalItem) {
        throw new Error(`Original item did not exist: ${itemId}`);
      }
      if (updatedItem.type === 'NonContainer' && originalItem.type === 'Container' && originalItem.itemsInside.length > 0) {
        throw new Error('Container is not empty. Cannot convert to item');
      }
      if (originalItem.parentId !== updatedItem.parentId) {
        // update parent
        const originalParent = state.items[originalItem.parentId] as ContainerItem;
        originalParent.itemsInside = originalParent.itemsInside.filter(itemId => itemId !== itemId);
        const newParent = state.items[updatedItem.parentId] as ContainerItem;
        newParent.itemsInside.push(itemId);
      }
      if (updatedItem.type === 'Container') {
        state.items[itemId] = {
          ...originalItem,
          ...updatedItem,
          id: itemId,
          itemsInside: [],
        }
      } else {
        state.items[itemId] = {
          ...originalItem,
          ...updatedItem,
          id: itemId,
        }
      }
    }
  }
});

const { addItem: addItemFn, editItem: editItemFn } = inventorySlice.actions

export default inventorySlice.reducer;
export const addItem: ActionCreatorWithPayload<AddItemParams> = addItemFn;
export const editItem: ActionCreatorWithPayload<EditItemParams> = editItemFn;