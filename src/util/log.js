import { stringify, isNullOrEmpty } from './string.js';

/**
 * interpolates a format string (template literal) with stringified version of elements in variables
 *
 * @param { string } format string to interpolate variables into
 * @param { Array|string } variables list of variables to interpolate
 * @return { string } interpolated format string
 */
const interpolateLiteral = (format, variables) => {
  let interpolated = '';

  for (let i = 0; i < format.length; i++) {
    interpolated = interpolated + format[i];

    if (variables.length >= i + 1) {
      interpolated = interpolated + stringify(variables[i]);
    }
  }

  return interpolated;
};

/**
 * interpolates a format string replacing {} in format with stringified version of elements in variables
 *
 * @param { string } format string to interpolate variables into
 * @param { Array|string } variables list of variables to interpolate
 * @return { string } interpolated format string
 */
const interpolateString = (format, variables) => {
  const vars = (Array.isArray(variables)) ? variables : [variables];

  let postInterpolation = '',
    preInterpolation = format;

  for (let variableCount = 0, found = true; found && variableCount < vars.length; variableCount++) {
    const index = preInterpolation.indexOf('{}');

    if (index === -1) {
      found = false;
    } else {
      const replacement = stringify(variables[variableCount]);

      postInterpolation = postInterpolation + preInterpolation.substring(0, index) + replacement;
      preInterpolation = preInterpolation.substring(index + 2);
    }
  }

  return postInterpolation + preInterpolation;
};

/**
 * interpolates a format string replacing {} in format or a template literal with stringified version of elements in variables
 *
 * @return { string } interpolated string
 */
export const interpolate = (...args) =>{
  if (isNullOrEmpty(args) || !args[0]) {
    return '';
  } else if (!args[1] || args.length < 2) {
    return args[0];
  }

  const [format, ...variables] = args;

  return (Array.isArray(format) && args.length === format.length) ? interpolateLiteral(format, variables) : interpolateString(format, variables);
};
