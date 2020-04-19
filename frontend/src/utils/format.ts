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

/**
 * Format a date as DD/MM/YYYY.
 * If the day or the month are only one figure long, the left zero is not displayed.
 */
export function dateFormatter(date: Date): string {
    return (
        date
            .getDate()
            .toString()
            .padStart(2, "0") +
        "/" +
        date
            .getMonth()
            .toString()
            .padStart(2, "0") +
        "/" +
        date
            .getFullYear()
            .toString()
            .padStart(4, "0")
    );
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
