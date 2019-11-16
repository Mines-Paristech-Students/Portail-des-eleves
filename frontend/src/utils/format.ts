/**
 * Format a date as DD/MM/YYYY.
 * If the day or the month are only one figure long, the left zero is not displayed.
 */
export function dateFormatter(date: Date): string {
    return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
}


/**
 * Return `singularForm` if abs(decider) < 2, `pluralForm` otherwise (French rules).
 */
export function pluralFormatter(decider: number, singularForm: string, pluralForm: string) : string {
    return Math.abs(decider) < 2 ? singularForm : pluralForm;
}
