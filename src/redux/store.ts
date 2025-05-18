import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});

const persistConfig = {
  key: "root", // key in localStorage
  storage,
  whitelist: ["auth"], // only persist the 'auth' slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist needs this to be false
    }),
});

export const persistor = persistStore(store);

// If you already have types like RootState, AppDispatch:
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
