import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
  },
});

// برای تایپ‌ها:
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
