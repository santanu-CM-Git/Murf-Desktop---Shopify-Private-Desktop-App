// redux/redirectSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shouldRedirect: false,
};

const redirectSlice = createSlice({
  name: 'redirect',
  initialState,
  reducers: {
    triggerRedirect: (state) => {
      state.shouldRedirect = true;
    },
    resetRedirect: (state) => {
      state.shouldRedirect = false;
    },
  },
});

export const { triggerRedirect, resetRedirect } = redirectSlice.actions;

export default redirectSlice.reducer;
