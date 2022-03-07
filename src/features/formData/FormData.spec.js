import FormData from './FormData.jsx';
import { Provider } from 'react-redux';
import store from '../../app/store.js';
import React from 'react';
import { render, screen } from '@testing-library/react';

// import storage from '../../util/storage.js';
// import { mockEvent } from '../../setupTests.js';

describe('FormData', () => {
  it('should render without crashing', async() => {
    const div = document.createElement('div');

    render(<Provider store={store}>
      <FormData />
    </Provider>, div);

    expect(await screen.findByText('API URL')).toBeTruthy();
  });
});
