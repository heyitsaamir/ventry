import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux';
import inventoryReducer from './inventory'
import { State } from './types';

const store = configureStore({
  reducer: {
    inventory: inventoryReducer
  }
});

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export default store;