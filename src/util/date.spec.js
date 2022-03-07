import { formatDate } from './date.js';

describe('date utils', () => {
  it.each([
    ['yyyy-MM-dd h:mm:ss a', '2022-01-03T15:15:37', '2022-01-03 3:15:37 pm'],
    ['yy-MM-dd hh:mm:ss p', '2022-01-03T17:15:37', '22-01-03 05:15:37 p.m.'],
    ['yy-M-dd h:m:ss p', '2021-11-22T17:04:37', '21-11-22 5:4:37 p.m.'],

    // why not just test everything?
    ['yy yyyy M MM MMM d dd ddd E D h hh H HH m mm s S SSS a p', '2021-11-22T17:04:37.005', '21 2021 11 11 Nov 22 22 Monday Mon 22th 5 05 17 17 4 04 37 5 005 pm p.m.']
  ])('should handle format strings correctly', (formatString, date, expected) => {
    expect(formatDate(formatString, new Date(date))).toEqual(expected);
  });
});
