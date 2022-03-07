import {
  getObjectFromSeparatedString,
  isNullOrEmpty,
  looksLikeJSON, objectToFormBody,
  objectToSeparatedString,
  recordToString,
  stringify,
  stringToObject,
} from './string.js';


describe('string util', () => {
  it.each([
    ['', true],
    ['abc', false],
    [123, false],
    [null, true],
    // eslint-disable-next-line no-undefined
    [undefined, true],
    ['null', false],
    ['undefined', false],
  ])('should check strings correctly', (str, expected) => {
    expect(isNullOrEmpty(str)).toEqual(expected);
  });

  it.each([
    [null, false],
    // eslint-disable-next-line no-undefined
    [undefined, false],
    ['', false],
    ['{', false],
    ['[', false],
    ['[]', true],
    ['{}', true],
  ])('should guess JSON correctly', (str, expected) => {
    expect(looksLikeJSON(str)).toEqual(expected);
  });

  it('should convert a record to a string correctly', () => {
    const record = { field1: 'a', field2: 'b', field3: 'c' },
      expected = 'field1=a;field2=b;field3=c',
      separator = ';';

    expect(recordToString(record, separator)).toEqual(expected);
  });

  it.each([
    [null, ';', ''],
    [[{ a: 'b', c: 5 }, { d: 3, e: 2 }], ';', 'a=b;c=5\nd=3;e=2'],
  ])('should convert an object to a CSV string correctly', (obj, separator, expected) => {
    expect(objectToSeparatedString(obj, separator)).toEqual(expected);
  });

  it('should stringify undefined correctly', () => {
    // eslint-disable-next-line no-undefined
    expect(stringify(undefined)).toEqual('undefined');
  });

  it('should parse a CSV to an object correctly', () => {
    expect(getObjectFromSeparatedString('a=b;c=5\nd=3;e=2', ';')).toEqual([{ a: 'b', c: '5' }, { d: '3', e: '2' }]);
  });

  it.each(
    [
      ['[{"a":"d","b":"e"},{"f":"g","h":"i"}]', '', 'json', [{ a: 'd', b: 'e' }, { f: 'g', h: 'i' }]],
      ['', ';', 'JSON', []],
    ])('should convert a string to an object correctly', (str, separator, format, expected) => {
    expect(stringToObject(str, separator, format)).toEqual(expected);
  });

  it('should convert an object to a form body correctly', () => {
    const body = { field: 'value', 'other field': 'other value' },
      expected = 'field=value&other%20field=other%20value';

    expect(objectToFormBody(body)).toEqual(expected);
  });
});
