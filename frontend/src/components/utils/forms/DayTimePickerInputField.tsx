import { dayPickerLocalisationProps } from "./DayPickerField";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import React from "react";
import { useField } from "formik";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { DayPickerInputFieldProps } from "./DayPickerInputField";

// Required for formatting and parsing the date.
dayjs.extend(require("dayjs/plugin/customParseFormat"));

/**
 * A `DayPickerInput` component also accepting time and tied to a Formik field.
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
 * @param parseFormats defaults to `["DD/MM/YYYY HH:mm"]`. The formats used to
 * parse the date.
 * @param displayFormat defaults to `"DD/MM/YYYY HH:mm"`. The format used to
 * display the date.
 * @param todayButton defaults to `false`. If `true`, a `todayButton` will be
 * displayed in the day picker.
 * @param props passed to Formik's `useField`.
 */
export const DayTimePickerInputField = ({
  name,
  feedback = true,
  disabled = false,
  parseFormats = ["DD/MM/YYYY HH:mm"],
  displayFormat = "DD/MM/YYYY HH:mm",
  todayButton = false,
  ...props
}: DayPickerInputFieldProps) => {
  const [field, meta, helper] = useField<Date | undefined>({
    validate: (value) =>
      value === undefined && !disabled
        ? "Veuillez entrer une date et une heure au format JJ/MM/YYYY hh:mm."
        : undefined,
    ...props,
    name: name,
  });

  // Format a date to display in the input.
  const formatDate = (date) => dayjs(date).format(displayFormat);

  return (
    <>
      <DayPickerInput
        value={field.value}
        formatDate={formatDate}
        dayPickerProps={{
          ...dayPickerLocalisationProps(todayButton),
          month: field.value,
          selectedDays: field.value,
          onDayClick: (date) =>
            helper.setValue(
              dayjs(date)
                .hour(field.value ? field.value.getHours() : 0)
                .minute(field.value ? field.value.getMinutes() : 0)
                .toDate()
            ),
        }}
        inputProps={{
          className: `form-control ${
            !disabled && feedback && meta.error ? "is-invalid" : ""
          }`,
          placeholder: "JJ/MM/YYYY hh:mm",
          // Adding Formik's `onChange` will make everything buggy, because Formik will sometimes set
          // `field.value` to the _string_ value of the input, bypassing `react-day-picker`'s flow.
          onBlur: field.onBlur,
          onChange: (event) => {
            // @ts-ignore: the ability to use a `string[]` as `format` was introduced in 1.8.27 and the types
            // have not been updated yet. Also, the third parameter actually deals with the strict mode if
            // it's a boolean (not in the typing too).
            const d = dayjs(event.target.value, parseFormats, true);
            helper.setValue(d.isValid() ? d.toDate() : undefined);
          },
          disabled: disabled,
        }}
      />
    </>
  );
};
