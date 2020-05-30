/*
 * This file mainly contains helper functions useful for formatting dates.
 * One could think using a library like `moment.js` would be better. However, such a library may cover way too many
 * features for our needs, introducing a loading overhead. This is why we'd rather stay with those "artisanal" functions
 * for now.
 */

export const MONTHS: string[] = [
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
    "Décembre",
];

export const WEEKDAYS_LONG: string[] = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
];

export const WEEKDAYS_SHORT: string[] = [
    "dim.",
    "lun.",
    "mar.",
    "mer.",
    "jeu.",
    "ven.",
    "sam.",
];

/**
 * Format a date as `month YYYY`.
 */
export const formatLongDateMonthYear = (date?: Date) =>
    date
        ? `${MONTHS[
              date.getMonth()
          ].toLowerCase()} ${date.getFullYear().toString().padStart(4, "0")}`
        : "";

/**
 * Format a date as `DD month YYYY`.
 */
export const formatLongDate = (date?: Date) =>
    date
        ? `${date.getDate().toString().padStart(2, "0")} ${MONTHS[
              date.getMonth()
          ].toLowerCase()} ${date.getFullYear().toString().padStart(4, "0")}`
        : "";

/**
 * Format a date as DD/MM/YYYY.
 * The day and the month are left-padded with "0" until reaching two digits.
 * The year is left-padded with "0" until reaching four digits.
 */
export const formatDate = (date?: Date) =>
    date
        ? date.getDate().toString().padStart(2, "0") +
          "/" +
          (date.getMonth() + 1).toString().padStart(2, "0") +
          "/" +
          date.getFullYear().toString().padStart(4, "0")
        : "";

/**
 * Return the last two digits of a year (the return value always has two digits).
 */
export const formatShortYear = (year: number) =>
    (year % 100).toString().padStart(2, "0");

/**
 * Format a date as `HH:mm`.
 * The hours and the minutes are left-padded with "0" until reaching two digits.
 */
export const formatTime = (date?: Date) =>
    date
        ? date.getHours().toString().padStart(2, "0") +
          ":" +
          date.getMinutes().toString().padStart(2, "0")
        : "";

/**
 * Return `singularForm` if abs(decider) < 2, `pluralForm` otherwise (French rules).
 */
export const decidePlural = (
    decider: number,
    singularForm: string,
    pluralForm: string
) => (Math.abs(decider) < 2 ? singularForm : pluralForm);
