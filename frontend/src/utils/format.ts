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

export const WEEKDAYS_SHORT = [
    "dim.",
    "lun.",
    "mar.",
    "mer.",
    "jeu.",
    "ven.",
    "sam."
];

/**
 * Format a date as DD/MM/YYYY.
 * If the day or the month are only one figure long, the left zero is not displayed.
 */
export const formatDate = (date?: Date) =>
    date
        ? date
              .getDate()
              .toString()
              .padStart(2, "0") +
          "/" +
          (date.getMonth() + 1).toString().padStart(2, "0") +
          "/" +
          date
              .getFullYear()
              .toString()
              .padStart(4, "0")
        : "";

/**
 * Return the last two digits of a year (the return value always has two digits).
 */
export const formatShortYear = (year: number) =>
    (year % 100).toString().padStart(2, "0");

/**
 * Return `singularForm` if abs(decider) < 2, `pluralForm` otherwise (French rules).
 */
export const decidePlural = (
    decider: number,
    singularForm: string,
    pluralForm: string
) => (Math.abs(decider) < 2 ? singularForm : pluralForm);
