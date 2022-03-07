/**
 * reads file from an input form element and executes successCallback on the content
 * or errorCallback on an error
 *
 * @param { Blob|string } file The Blob or File from which to read.
 * @param { Function } successCallback function to execute on success
 * @param { Function } errorCallback function to execute on failure
 * @return { void }
 */
export const readFile = (file, successCallback, errorCallback) => {
  const reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {
    successCallback(reader.result);
  };

  reader.onerror = function() {
    errorCallback(reader.error);
  };
};

export const parseCSV = (str, separator) => {
  if (!str || !separator) {
    return [];
  } else if (str.indexOf(separator) === -1) {
    return [str];
  }

  return str.split('\n').map((dataStr) => {
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
