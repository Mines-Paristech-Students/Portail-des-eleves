import React, { useState } from "react";
import { useField, useFormikContext } from "formik";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { formatDate } from "../../../utils/format";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { parseDate } from "../../../utils/parse";
import { dayPickerLocalisationProps } from "./DatePickerField";

/**
 * This component encapsulates a `DayPickerInput` component into a `Form.Group` component, using the Formik logic and
 * including a label and a feedback. Use it like this:
 *
 * ```
 * <DatePickerInputField
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
export const DatePickerInputField = ({
    label,
    todayButton = false,
    ...props
}: any) => {
    const { setFieldValue, setFieldTouched } = useFormikContext();
    const [field, meta] = useField<Date>(props);

    // This field is required for setting a default value to the input.
    const [inputValue, setInputValue] = useState(field.value);

    const handleDayChange = (selectedDay) => {
        setFieldTouched(field.name as never, true);
        setFieldValue(field.name as never, selectedDay);
    };

    return (
        <Form.Group>
            <Form.Label>{label}</Form.Label>
            <DayPickerInput
                value={inputValue}
                onDayChange={handleDayChange}
                formatDate={formatDate}
                parseDate={
                    // The component will pass extra parameters to this anonymous function, but `parseDate` does not
                    // need them AND defines a second parameter which would be overwritten otherwise.
                    (dateString) => parseDate(dateString, "/")
                }
                dayPickerProps={{
                    ...field,
                    month: field.value,
                    selectedDays: field.value,
                    ...dayPickerLocalisationProps(todayButton),
                }}
                inputProps={{
                    className: `form-control ${meta.error ? "is-invalid" : ""}`,
                    placeholder: "JJ/MM/YYYY",
                    onChange: (e) => setInputValue(e.target.value),
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
