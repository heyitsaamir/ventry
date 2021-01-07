
import { combineReducers } from '@reduxjs/toolkit'
import inventoryReducer from './inventory'
const rootReducer = combineReducers({
  inventory: inventoryReducer
})

export default rootReducer;