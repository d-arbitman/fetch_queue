import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './app/store.js';
import App from './App.jsx';

test('renders App without crashing', () => {
  window.HTMLElement.prototype.scrollIntoView = function() {};

  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>);

  expect(getByText(/Fetch Queue/i)).toBeInTheDocument();
});
