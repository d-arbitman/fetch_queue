import { interpolate } from './log.js';

describe('log util', () => {
  it.each([
    ['this is a {}, and another {} {}', 'this is a test, and another one {}', 'test', 'one'],
    ['testing an array: {} and an object: {}', 'testing an array: [\"first element\",2,3] and an object: {\"a\":\"b\",\"c\":\"d\"}', ['first element', 2, 3], { a: 'b', c: 'd' }]
  ])('should interpolate correctly', (formatString, expected, ...variables) => {
    expect(interpolate(formatString, ...variables)).toEqual(expected);
  });

  it('should interpolate template literals correctly', () => {
    const a = 'something';

    expect(interpolate`some string: ${ 1 + 1 }, ${ a }`).toEqual('some string: 2, something');
  });
});
