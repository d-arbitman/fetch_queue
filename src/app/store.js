import { configureStore } from '@reduxjs/toolkit';
import formDataReducer from '../features/formData/formData.slice.js';
import logReducer from '../features/log/Log.slice.js';

const store = configureStore({
  reducer: {
    formData: formDataReducer,
    log: logReducer,
  },
});

export default store;
