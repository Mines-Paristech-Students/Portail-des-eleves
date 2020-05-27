/*
 * Please see the comment at the top of `format.ts` to understand why we define these functions instead of using
 * a 3rd-party library.
 */

/**
 * Parse a date formatted as 24/05/2020 (French style).
 *
 * Return a Date or undefined if the date could not be parsed. If the month is not in [1; 12] or the day not in [1; 31],
 * undefined will be returned.
 */
export const parseDate = (
    dateString: string,
    separator = "/"
): Date | undefined => {
    const split = dateString.split(separator);

    if (split.length !== 3) {
        return undefined;
    }

    const year = Number(split[2]);
    // Months start at 0.
    const month = Number(split[1]) - 1;
    const day = Number(split[0]);

    // This is obviously a very imperfect check.
    if (year < 0 || month < 0 || month > 11 || day < 1 || day > 31) {
        return undefined;
    }

    const date = new Date(year, month, day);

    return isNaN(date.getTime()) ? undefined : date;
};
