import React from "react";
import { FieldAttributes, useField } from "formik";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import { MONTHS, WEEKDAYS_LONG, WEEKDAYS_SHORT } from "../../../utils/format";

export const dayPickerLocalisationProps = (todayButton = false) => ({
  todayButton: todayButton ? "Aujourd’hui" : "",
  locale: "fr",
  months: MONTHS,
  weekdaysLong: WEEKDAYS_LONG,
  weekdaysShort: WEEKDAYS_SHORT,
  firstDayOfWeek: 1,
});

export type DatePickerFieldProps = {
  name: string;
  todayButton?: boolean;
} & FieldAttributes<any>;

/**
 * A `DayPicker` component tied to a Formik field.
 *
 * @param name the name of the control, given to Formik's `useField`.
 * @param todayButton defaults to `false`. If `true`, a “Today” button is displayed.
 * @param props passed to `useField` and `Form.Control`.
 */
export const DayPickerField = ({
  name,
  todayButton = false,
  ...props
}: DatePickerFieldProps) => {
  const [field, , helper] = useField<Date | undefined>({
    name: name,
    ...props,
  });

  return (
    <DayPicker
      {...field}
      month={field.value}
      selectedDays={field.value}
      onDayClick={(day) => helper.setValue(day)}
      {...dayPickerLocalisationProps(todayButton)}
    />
  );
};
