import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import personReducer from './slices/personSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    person: personReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;