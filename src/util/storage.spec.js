import storage from './storage.js';

describe('storage utils', () => {
  it('should store API URLs correctly', () => {
    const urls = ['https://www.test.com/example', 'https://example.com/test'];

    for (let i = 0; i < urls.length; i++) {
      storage.setApiUrl(urls[i]);
    }

    expect(storage.getApiUrls().sort()).toEqual(urls.sort());
  });
});
