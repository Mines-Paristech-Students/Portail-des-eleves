export const MONTHS = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
];

export const WEEKDAYS_LONG = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi"
];

export const WEEKDAYS_SHORT = ["di", "lu", "ma", "me", "je", "ve", "sa"];

export const HOURS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
export const MINUTES = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]

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
export function pluralFormatter(
    decider: number,
    singularForm: string,
    pluralForm: string
): string {
    return Math.abs(decider) < 2 ? singularForm : pluralForm;
}
