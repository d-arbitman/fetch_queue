/**
 * returns true if argument is null, undefined or empty
 *
 * @param { object } str variable to check
 * @return { boolean } if the argument is null, undefined or empty
 */
export const isNullOrEmpty = (str) => {
  return (str === null || typeof str === 'undefined' || str.length === 0);
};

/**
 * returns a string representation of str
 *
 * @param { object } str variable to convert
 * @return { object } string representation of argument
 */
export const stringify = (str) => {
  const strType = typeof str;

  if (strType === 'undefined') {
    return 'undefined';
  } else if (strType === 'string') {
    return str;
  }

  return JSON.stringify(str);
};

/**
 * determines if a variable is a string, and it looks like it is JSON
 *
 * @param { object } questionableJson object to check
 * @return { boolean } whether it looks like JSON
 */
export const looksLikeJSON = (questionableJson) => {
  if (typeof questionableJson === 'string') {
    const trimmed = questionableJson.trim();

    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      return true;
    }
  }

  return false;
};

/**
 * parse record to a string of key-value pairs, reverse of getObjectFromSeparatedString
 *
 * @param { object } record to parse
 * @param { string } separator value to separate key-value pairs with
 * @return {string} parsed record
 */
export const recordToString = (record, separator) => {
  return Object.keys(record)
    .map(key => key + '=' + record[key])
    .join(separator);
};

/**
 * parse a list of records to a string of key-value pairs, reverse of getObjectFromSeparatedString
 *
 * @param { Array } data to parse
 * @param { string } separator value to separate key-value pairs with
 * @return { string } parsed records
 */
export const objectToSeparatedString = (data, separator) => {
  if (!data) {
    return '';
  }

  return data.map(record => recordToString(record, separator)).join('\n');
};

/**
 * parse form body-like string to an object (e.g. <code>key=value;key2=value2...</code>)
 *
 * @param { string } separatedString to parse
 * @param { string } separator string separating values
 * @return { object } parsed object
 */
export const getObjectFromSeparatedString = (separatedString, separator) => {
  return separatedString.split('\n').map((dataStr) => {
    const data = {};

    dataStr.split(separator).forEach((item) => {
      const [key, value, ...rest] = item.split('=');

      if (key) {
        data[key] = value + (rest && rest.length ? '=' + rest.join('=') : '');
      }
    });

    return data;
  });
};

export const stringToObject = (str, separator, format) => {
  if (!str) {
    return [];
  }

  if (format.toLowerCase() === 'json') {
    const json = JSON.parse(str);

    return isIterable(json) ? json : [json];
  }

  return getObjectFromSeparatedString(str, separator);
};

/**
 * returns if a variable is iterable
 *
 * @param { object } obj object to determine if iterable
 * @return { boolean } is obj iterable?
 */
const isIterable = (obj) => {
  return Symbol.iterator in Object(obj);
};

/**
 * convert simple object to form body for HTTP post
 *
 * @param { object|string } details object to convert
 * @return { string } form body from object
 */
export const objectToFormBody = (details) => {
  const formBody = [];

  for (const property in details) {
    if (Object.prototype.hasOwnProperty.call(details, property)) {
      formBody.push(encodeURIComponent(property) + '=' + encodeURIComponent(details[property]));
    }
  }

  return formBody.join('&');
};
