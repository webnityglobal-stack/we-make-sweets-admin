import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
// import other slices as needed

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // other: otherReducer,
  },
});ls
