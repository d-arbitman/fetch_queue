import React from 'react';
import Log from './Log.jsx';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import configureStore from 'redux-mock-store';

let store;

describe('Log', () => {
  const mockStore = configureStore({ level: 'info', entries: [] });

  beforeEach(() => {
    store = mockStore({ log: { entries: [], level: 'info' } });
    store.dispatch = jest.fn();
    renderLog();
  });

  it('should render correctly with log entries', async() => {
    store = mockStore({
      log: {
        level: 'info',
        entries: [
          { date: new Date().getTime(), level: 'info', message: 'log message one' },
          { date: new Date().getTime(), level: 'info', message: 'log message two' }],
      },
    });

    renderLog();

    expect(await screen.findByText('log message one')).toBeTruthy();
    expect(await screen.queryByText('log message two')).toBeTruthy();
    expect(await screen.queryByText('log message three')).toBeNull();
  });

  it('should filter entries correctly', async() => {
    store = mockStore({
      log: {
        level: 'info',
        entries: [
          { date: new Date().getTime(), level: 'info', message: 'log message one' },
          { date: new Date().getTime(), level: 'debug', message: 'log message two' },
          { date: new Date().getTime(), level: 'error', message: 'log message three' }],
      },
    });

    renderLog();

    expect(await screen.findByText('log message one')).toBeTruthy();
    expect(await screen.queryByText('log message two')).toBeNull();
    expect(await screen.queryByText('log message three')).toBeTruthy();
  });
});

const renderLog = () => {
  render(
    <Provider store={store}>
      <Log />
    </Provider>,
  );
};
