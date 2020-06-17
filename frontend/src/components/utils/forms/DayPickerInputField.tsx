import React from "react";
import { FieldAttributes, useField } from "formik";
import dayjs from "dayjs";
import { dayPickerLocalisationProps } from "./DayPickerField";
import DayPickerInput from "react-day-picker/DayPickerInput";

// Required for formatting and parsing the date.
dayjs.extend(require("dayjs/plugin/customParseFormat"));

export type DayPickerInputFieldProps = {
  name: string;
  feedback?: boolean;
  disabled?: boolean;
  parseFormats?: string | string[];
  displayFormat?: string;
  todayButton?: boolean;
} & FieldAttributes<any>;

/**
 * A `DayPickerInput` component tied to a Formik field.
 *
 * The value of the field (accessible in `values[name]`) is a `Date` object or
 * `undefined` if the `Date` is invalid (i.e. when the input contains something
 * which could not be parsed).
 *
 * Please note that due to an unexplained behaviour of Formik when clicking on
 * Submit several times in a row, the condition for showing the feedback is that
 * `errors[name]` is set and `feedback` is true (`touched` has thus no effect).
 *
 * @param name the name of the control, used to access its value in Formik.
 * @param feedback defaults to true. If `true`, the `is-invalid` class is given
 * to the input component when needed.
 * @param disabled defaults to `false`. If `true`, the input is disabled.
 * @param parseFormats defaults to `["DD/MM/YYYY"]`. The formats used to parse
 * the date.
 * @param displayFormat defaults to `"DD/MM/YYYY"`. The format used to display
 * the date.
 * @param todayButton defaults to `false`. If `true`, a `todayButton` will be
 * displayed in the day picker.
 * @param props passed to Formik's `useField`.
 */
export const DayPickerInputField = ({
  name,
  feedback = true,
  disabled = false,
  parseFormats = ["DD/MM/YYYY"],
  displayFormat = "DD/MM/YYYY",
  todayButton = false,
  ...props
}: DayPickerInputFieldProps) => {
  const [field, meta, helper] = useField<Date | undefined>({
    validate: (value) =>
      value === undefined && !disabled
        ? "Veuillez entrer une date au format JJ/MM/YYYY."
        : undefined,
    ...props,
    name: name,
  });

  // Format a date to display in the input.
  const formatDate = (date) => dayjs(date).format(displayFormat);

  // Parse a date from the input.
  const parseDate = (dateString) => {
    // @ts-ignore: the ability to use a `string[]` as `format` was introduced in 1.8.27 and the types have not
    // been updated yet.
    const d = dayjs(dateString, parseFormats);

    // `undefined` is used when there is an invalid date.
    return d.isValid() ? d.toDate() : undefined;
  };

  // Called when the user types into the input field or when a day is clicked on the calendar.
  const handleDayChange = (selectedDay) => {
    if (selectedDay) {
      helper.setValue(dayjs(selectedDay).hour(0).minute(0).toDate());
    } else {
      helper.setValue(undefined);
    }
  };

  return (
    <>
      <DayPickerInput
        value={field.value}
        formatDate={formatDate}
        parseDate={parseDate}
        onDayChange={handleDayChange}
        dayPickerProps={{
          month: field.value,
          selectedDays: field.value,
          ...dayPickerLocalisationProps(todayButton),
        }}
        inputProps={{
          className: `form-control ${
            !disabled && feedback && meta.error ? "is-invalid" : ""
          }`,
          placeholder: "JJ/MM/YYYY",
          // Adding Formik's `onChange` will make everything buggy, because Formik will sometimes set
          // `field.value` to the _string_ value of the input, bypassing `react-day-picker`'s flow.
          onBlur: field.onBlur,
          disabled: disabled,
        }}
      />
    </>
  );
};
