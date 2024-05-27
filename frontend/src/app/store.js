import { configureStore, combineReducers } from "https://cdn.skypack.dev/@reduxjs/toolkit";
import { persistStore, persistReducer } from "https://cdn.skypack.dev/redux-persist";
import storage from "https://cdn.skypack.dev/redux-persist/lib/storage";
import authReducer from "../features/auth/authSlice";
import itemReducer from "../features/item/itemSlice";

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  item: itemReducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only auth will be persisted
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
});

// Persistor for the store
export const persistor = persistStore(store);
