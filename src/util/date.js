const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * get the ordinal (1st, 2nd, 3rd ... 31st) for a date
 *
 * @param { number } dateNum date number to get ordinal for
 * @return { string } ordinal
 */
const getOrdinal = (dateNum) => {
  if (dateNum === 1 || dateNum === 31 || dateNum === 21) {
    return dateNum + 'st';
  } else if (dateNum === 2) {
    return '2nd';
  } else if (dateNum === 3) {
    return '3rd';
  }
  return dateNum + 'th';
};

/**
 * Format date using the following format strings
 * <pre>
 *   yy - short year
 *   yyyy - long year
 *   M - month (1-12)
 *   MM - month (01-12)
 *   MMM - month abbreviation (Jan, Feb ... Dec)
 *   MMMM - long month (January, February ... December)
 *   d - day (1 - 31)
 *   dd - day (01 - 31)
 *   ddd - day of the week in words (Sunday, Monday, ... Saturday)
 *   E - short day of the week in words (Sun, Mon, ... Sat)
 *   D - Ordinal day (1st, 2nd, 3rd, 21st, 22nd, 23rd, 31st, 4th...)
 *   h - hour in am/pm (0-12)
 *   hh - hour in am/pm (00-12)
 *   H - hour in day (0-23)
 *   HH - hour in day (00-23)
 *   m - minute
 *   mm - minute (00 - 59)
 *   s - seconds
 *   ss - seconds (00 - 59)
 *   S - milliseconds
 *   SSS - (000 - 999)
 *   a - am/pm marker
 *   p - a.m./p.m. marker
 * </pre>
 *
 * @param {string} format to return
 * @param {Date} dateToUse date to use for formatting
 * @return {string} date formatted as specified
 */
export const formatDate = (format, dateToUse) => {
  const date = (dateToUse) ? dateToUse : new Date(),
    replacement = {
      yy: date.getFullYear().toString(10).slice(-2),
      yyyy: date.getFullYear(),
      M: date.getMonth() + 1,
      MM: (date.getMonth() + 1).toString(10).padStart(2, '0'),
      MMM: months[date.getMonth()].substring(0, 3),
      MMMM: months[date.getMonth()],
      d: date.getDate(),
      dd: date.getDate().toString(10).padStart(2, '0'),
      ddd: days[date.getDay()],
      E: days[date.getDay()].substring(0, 3),
      D: getOrdinal(date.getDate()),
      h: mod12(date.getHours()),
      hh: mod12(date.getHours()).toString(10).padStart(2, '0'),
      H: date.getHours().toString(10),
      HH: date.getHours().toString(10).padStart(2, '0'),
      m: date.getMinutes().toString(10),
      mm: date.getMinutes().toString(10).padStart(2, '0'),
      s: date.getSeconds().toString(10),
      ss: date.getSeconds().toString(10).padStart(2, '0'),
      S: date.getMilliseconds().toString(10),
      SSS: date.getMilliseconds().toString(10).padStart(3, '0'),
      a: date.getHours() < 12 ? 'am' : 'pm',
      p: date.getHours() < 12 ? 'a.m.' : 'p.m.',
    };

  return format.split(/([a-zA-Z]+)/).map(token => {
    const type = typeof replacement[token];

    return (type !== 'null' && type !== 'undefined') ? replacement[token] : token;
  }).join('');
};

/**
 * converts a 0 - 23 hour to 1 - 12
 *
 * @param { number } hour to convert
 * @return { number } hour (1 - 12)
 */
const mod12 = (hour) => {
  return (hour === 12) ? 12 : hour % 12;
};
