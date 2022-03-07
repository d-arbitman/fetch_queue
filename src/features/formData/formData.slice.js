import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  apiUrl: '',
  contentType: '',
  format: 'JSON',
  separator: ';',
  data: '',
  downloadUrl: ''
};

export const formDataSlice = createSlice({
  name: 'formData',
  initialState,

  reducers: {
    setValue: (state, action) => {
      if (action.payload.name && action.payload.name in state) {
        state[action.payload.name] = action.payload.value;
      }
    },
    setMultipleValues: (state, action) => {
      return { ...state, ...action.payload };
    }
  },
});

export const { setValue, setMultipleValues } = formDataSlice.actions;

export default formDataSlice.reducer;
