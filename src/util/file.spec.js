import { parseCSV } from './file.js';

describe('file util', () => {
  it.each([
    ['', ',', []],
    ['a=1;b=2;c=3\nd=4;e=5;f=6', ';', [{ a: '1', b: '2', c: '3' }, { d: '4', e: '5', f: '6' }]]
  ])('should parse correctly', (str, separator, expected) => {
    expect(parseCSV(str, separator)).toEqual(expected);
  });
});
