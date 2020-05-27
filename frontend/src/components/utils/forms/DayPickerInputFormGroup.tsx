import React from "react";
import { useFormikContext } from "formik";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import {
    DayPickerInputField,
    DayPickerInputFieldProps,
} from "./DayPickerInputField";

/**
 * Display a `DayPickerInputField` in a `Form.Group`, using Formik to manage the underlying field.
 *
 * Please note that due to an unexplained behaviour of Formik when clicking on Submit several times in a row, the
 * condition for showing the feedback is that `errors[name]` is set and `feedback` is true (touched has thus no effect).
 *
 * Props:
 *     - name: the name of the control, used to access its value in Formik.
 *     - label: optional, the label to display.
 *     - feedback: defaults to true. If `true`, a `FormControl.Feedback` is added at the bottom of the `Form.Group`.
 *     `DayPickerInputField`'s `feedback` props is set to the same value, unless overridden in
 *     `dayPickerInputFieldProps`.
 *     - props: passed to Formik's `useField`.
 */
export const DayPickerInputFormGroup = ({
    name,
    label = "",
    feedback = true,
    dayPickerInputFieldProps,
}: {
    name: string;
    label?: string;
    feedback?: boolean;
    dayPickerInputFieldProps?: DayPickerInputFieldProps;
}) => {
    const { errors, touched } = useFormikContext();

    return (
        <Form.Group>
            {label && <Form.Label>{label}</Form.Label>}
            <DayPickerInputField
                name={name}
                feedback={feedback}
                {...dayPickerInputFieldProps}
            />
            {feedback && errors[name] && (
                <FormControl.Feedback
                    type="invalid"
                    className="date-picker-feedback"
                >
                    {errors[name]}
                </FormControl.Feedback>
            )}
        </Form.Group>
    );
};
