import React from "react";
import { useField, useFormikContext } from "formik";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import { MONTHS, WEEKDAYS_LONG, WEEKDAYS_SHORT } from "../../../utils/format";
import "./date-picker-field.css";

export function DatePickerField({ label, ...props }: any) {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField<Date>(props);

    return (
        <>
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
                    initialMonth={field.value}
                    selectedDays={field.value}
                    onDayClick={day => setFieldValue(field.name as never, day)}
                    locale="fr"
                    months={MONTHS}
                    weekdaysLong={WEEKDAYS_LONG}
                    weekdaysShort={WEEKDAYS_SHORT}
                    firstDayOfWeek={1}
                />
            </Form.Group>
        </>
    );
}
