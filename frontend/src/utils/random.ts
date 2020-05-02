/**
 * Return a random item from `array`.
 */
export function getRandom(array: Array<any>): any {
    return array[Math.floor(Math.random() * array.length)];
}
