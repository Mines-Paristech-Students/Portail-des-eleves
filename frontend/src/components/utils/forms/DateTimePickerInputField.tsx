import React from "react";
import { useField, useFormikContext } from "formik";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import {
    formatDate,
    MONTHS,
    WEEKDAYS_LONG,
    WEEKDAYS_SHORT,
} from "../../../utils/format";
import DayPickerInput from "react-day-picker/DayPickerInput";

/**
 * This component encapsulates a `DayPickerInput` component and two inputs (one for the hours, one for the minutes)
 * into a `Form.Group` component, using the Formik logic and including a label and a feedback. Use it like this:
 *
 * ```
 * <DateTimePickerInputField
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
 *     - todayButton: optional. The string to display as a “Today” button.
 *     - props: passed to Formik's `useField`.
 */
export const DateTimePickerInputField = ({
    label,
    todayButton = "",
    ...props
}: any) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField<Date>(props);

    return (
        <Form.Group>
            <Form.Label>{label}</Form.Label>
            <DayPickerInput
                {...field}
                onDayChange={(day) => setFieldValue(field.name as never, day)}
                formatDate={formatDate}
                dayPickerProps={{
                    todayButton: todayButton || "",
                    locale: "fr",
                    months: MONTHS,
                    weekdaysLong: WEEKDAYS_LONG,
                    weekdaysShort: WEEKDAYS_SHORT,
                    firstDayOfWeek: 1,
                }}
                inputProps={{
                    className: "form-control",
                }}
            />
            {meta.touched && meta.error ? (
                <FormControl.Feedback
                    type="invalid"
                    className="date-picker-feedback"
                >
                    {meta.error}
                </FormControl.Feedback>
            ) : null}
        </Form.Group>
    );
};
