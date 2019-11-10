/**
 * Format a date as DD/MM/YYYY.
 * If the day or the month are only one figure long, the left zero is not displayed.
 */
export function dateFormatter(date: Date): string {
    return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
}
