import formDataReducer, {
  setValue, setMultipleValues
} from './formData.slice.js';

describe('formData reducer', () => {
  const initialState = {
    apiUrl: '',
    contentType: '',
    format: 'JSON',
    data: '',
    downloadUrl: '',
    separator: ';'
  };

  it('should handle initial state', () => {
    // eslint-disable-next-line no-undefined
    const actual = formDataReducer(undefined, { type: 'unknown' });

    expect(actual).toEqual(initialState);
  });

  it('should handle setting values', () => {
    const newState = {
      apiUrl: 'https://localhost/test',
      format: 'JSON',
      concurrentConnections: 5
    };

    expect(formDataReducer(initialState, setMultipleValues(newState))).toEqual({ ...initialState, ...newState });
  });

  it('should handle setting multiple values', () => {
    let actual;

    actual = formDataReducer(initialState, setValue({ name: 'apiUrl', value: 'https://localhost/test' }));
    expect(actual.apiUrl).toEqual('https://localhost/test');

    actual = formDataReducer(initialState, setValue({ name: 'contentType', value: 'application/json' }));
    expect(actual.contentType).toEqual('application/json');
  });
});
