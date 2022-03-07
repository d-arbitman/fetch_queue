import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  level: 'info',
  entries: []
};

export const logSlice = createSlice({
  name: 'log',
  initialState,

  reducers: {
    appendLog: (state, action) => {
      state.entries.push({ ...action.payload, date: (action.payload.date || new Date()).getTime() });
      return state;
    },
    clearLog: (state) => {
      state.entries = [];
      return state;
    },
    setLevel: (state, action) => {
      state.level = action.payload;
      return state;
    }
  },
});

export const { appendLog, clearLog, setLevel } = logSlice.actions;

export default logSlice.reducer;
