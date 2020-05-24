import React from "react";
import { useField, useFormikContext } from "formik";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import { MONTHS, WEEKDAYS_LONG, WEEKDAYS_SHORT } from "../../../utils/format";
import "./date-picker-field.css";

export const dayPickerLocalisationProps = (todayButton = false) => ({
    todayButton: todayButton ? "Aujourd’hui" : "",
    locale: "fr",
    months: MONTHS,
    weekdaysLong: WEEKDAYS_LONG,
    weekdaysShort: WEEKDAYS_SHORT,
    firstDayOfWeek: 1,
});

/**
 * This component encapsulates a `DayPicker` component into a `Form.Group` component, using the Formik logic and
 * including a label and a feedback. Use it like this:
 *
 * ```
 * <DatePickerField
 *     label="Date de publication"
 *     name="publicationDate"
 * />
 * ```
 *
 * Then, use `values.publicationDate` to access the value of this control. Please note that `values.publicationDate` is
 * a JavaScript `Date` object, and you may have to serialize it to a string manually for the backend to understand it.
 *
 * Props:
 *     - label: the label to display.
 *     - todayButton: defaults to false. If true, a “Today” button is displayed.
 *     - props: passed to Formik's `useField`.
 */
export const DatePickerField = ({
    label,
    todayButton = false,
    ...props
}: any) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField<Date>(props);

    return (
        <Form.Group>
            <Form.Label>{label}</Form.Label>
            {meta.touched && meta.error ? (
                <FormControl.Feedback
                    type="invalid"
                    className="date-picker-feedback"
                >
                    {meta.error}
                </FormControl.Feedback>
            ) : null}
            <DayPicker
                {...field}
                month={field.value}
                selectedDays={field.value}
                onDayClick={(day) => setFieldValue(field.name as never, day)}
                {...dayPickerLocalisationProps(todayButton)}
            />
        </Form.Group>
    );
};
