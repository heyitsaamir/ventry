import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createMigrate,
} from "redux-persist";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import rootReducer from "./rootReducer";
import { v0Migration } from "./migrations/v0";
import { v1Migration } from "./migrations/v1";

const persistedReducer = persistReducer(
  {
    key: "root",
    storage: AsyncStorage,
    version: 1,
    migrate: createMigrate({ "0": v0Migration, "1": v1Migration }, { debug: true }),
  },
  rootReducer
);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
  devTools: true,
});
const persistor = persistStore(store);

export default { store, persistor };
