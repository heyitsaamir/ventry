
import { combineReducers } from '@reduxjs/toolkit'
import inventoryReducer from './inventory'
import undoable from 'redux-undo';

const rootReducer = combineReducers({
  inventory: undoable(inventoryReducer, { limit: 5 })
})

export default rootReducer;