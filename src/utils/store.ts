import reducer from "slices";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

export const store = configureStore({
  reducer: reducer,
  middleware: customizedMiddleware,
});
