import { combineReducers } from "@reduxjs/toolkit";
import inventoryReducer from "./inventory";
import undoable from "redux-undo";
import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const rootReducer = combineReducers({
  inventory: persistReducer({ key: 'inventory', storage: AsyncStorage, blacklist: ['past', 'future', '_latestUnfiltered'] }, undoable(inventoryReducer, { limit: 5 })),
});

export default rootReducer;
