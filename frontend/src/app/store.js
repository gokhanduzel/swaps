import { configureStore, combineReducers } from "https://cdn.skypack.dev/@reduxjs/toolkit";
import { persistStore, persistReducer } from "https://cdn.skypack.dev/redux-persist";
import storage from "https://cdn.skypack.dev/redux-persist/lib/storage";
import authReducer from "../features/auth/authSlice";
import itemReducer from "../features/item/itemSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  item: itemReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only auth will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);