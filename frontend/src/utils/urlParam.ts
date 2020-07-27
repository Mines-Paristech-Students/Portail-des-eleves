import dayjs from "dayjs";

type UrlParam =
  | undefined
  | boolean
  | number
  | string
  | (boolean | number | string)[]
  | { [key: string]: UrlParam };

/**
 * Transforms an object into URL parameters. The returned string joins the parameters found in the object with '&'
 * and adds '?' at the beginning.
 * The keys and the values of the object are respectively the names and the values of the URL parameters.
 * If an array is passed as a value, the parameter will be repeated for each item of the array.
 * If an object is passed as a value, its key (in the top `parameters` object) will prefix (with a `__` separator) its
 * keys.
 * The values should be numbers, strings or booleans. A boolean value will be transformed into either `true` or `false`.
 *
 * Examples:
 * ```
 * toUrlParams({
 *     foo: 1,
 *     piche: 'clac'
 * }
 * == "?foo=1&piche=clac"
 * ```
 * ```
 * toUrlParams({
 *     foo: true,
 *     bar: {
 *         in: "it",
 *         gte: 3,
 *     },
 *     piche: ['clic', 'clac']
 * }
 * == "?foo=true&bar__in=it&bar__gte=3&piche=clic&piche=clac"
 * ```
 */
export const toUrlParams = (parameters: { [key: string]: UrlParam }): string =>
  "?" + toUrlParamsAux(parameters);

const toUrlParamsAux = (
  parameters: {
    [key: string]: UrlParam;
  },
  keyPrefix = ""
) =>
  // Iterate through the keys.
  Object.getOwnPropertyNames(parameters)
    .map((key) => {
      const value = parameters[key];

      return value === undefined
        ? ""
        : Array.isArray(value)
        ? // Iterate through the array.
          `${keyPrefix + key}=${value.join(",")}`
        : typeof value === "object"
        ? // Recursive call with a new prefix.
          toUrlParamsAux(value, keyPrefix + key + "__")
        : `${keyPrefix + key}=${value}`;
    })
    .filter((x) => x !== "")
    .join("&");

/**
 * Format a date object for it to be used in `toUrlParams`.
 *
 * @param dates an object whose values are `Date` objects or `undefined`.
 * `undefined` are skipped and will no be present in the return value.
 * @param format either a string which will be used to format all the dates
 * or an object with the same keys as `dates` to give a specific format to
 * each key.
 */
export const castDatesToUrlParam = (
  dates: {
    [key: string]: Date | undefined;
  },
  format: string | { [key: string]: string } = "YYYY-MM-DD"
): { [key: string]: UrlParam } => {
  let r = {};

  if (typeof format === "object") {
    for (let key of Object.getOwnPropertyNames(dates)) {
      r[key] = dates[key] ? dayjs(dates[key]).format(format[key]) : undefined;
    }
  } else {
    for (let key of Object.getOwnPropertyNames(dates)) {
      r[key] = dates[key] ? dayjs(dates[key]).format(format) : undefined;
    }
  }

  return r;
};
