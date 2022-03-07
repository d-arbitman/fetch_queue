import logReducer, { appendLog, clearLog } from './Log.slice.js';

let initialState = {
    entries: [],
    level: 'info',
  },
  actual = {};

describe('Log reducer', () => {
  it('should handle initial state', () => {
    // eslint-disable-next-line no-undefined
    actual = logReducer(undefined, { type: 'unknown' });
    expect(actual.entries).toEqual([]);
  });

  it('should handle appending messages', () => {
    actual = initialState;
    const messages = [{
      date: new Date(),
      level: 'info',
      message: 'This is an info message',
    },
    {
      level: 'error',
      message: 'This is an error message',
    },
    {
      level: 'debug',
      message: 'This is a debug message',
    }];

    for (let i = 0; i < messages.length; i++) {
      actual = logReducer(actual, appendLog(messages[i]));
    }

    expect(actual).toEqual(expect.anything());
    expect(actual.entries.length).toEqual(messages.length);

    for (let i = 0; i < actual.length; i++) {
      expect({ level: actual[i].level, message: actual[i].message })
        .toEqual({ level: messages[i].level, message: messages[i].message });
    }
  });

  it('should handle clearing messages', () => {
    initialState = {
      entries: [{
        date: new Date(),
        level: 'info',
        message: 'This is an info message',
      },
      {
        level: 'error',
        message: 'This is an error message',
      },
      {
        level: 'debug',
        message: 'This is a debug message',
      }],
      level: 'info',
    };

    actual = logReducer(initialState, clearLog());
    expect(actual.entries).toEqual([]);
  });
});
