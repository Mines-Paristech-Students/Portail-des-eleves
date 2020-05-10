/**
 This file contains functions useful for dealing with URL parameters.
 */

/**
 * Join the non-empty elements of an array.
 * @param array The array to join.
 * @param separator A string used to separate one element of an array from the next in the resulting String.
 * If omitted, the array elements are separated with a comma.
 */
export const joinNonEmpty = (array: string[], separator?: string) =>
    array.filter(value => value !== "").join(separator);
