import React from "react";
import { useField, useFormikContext } from "formik";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import { MINUTES, HOURS, MONTHS, WEEKDAYS_LONG, WEEKDAYS_SHORT } from "../../../utils/format";
import "./date-picker-field.css";

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
 */
export function DatePickerField({ label, ...props }: any) {
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
                initialMonth={field.value}
                selectedDays={field.value}
                onDayClick={(day) => setFieldValue(field.name as never, day)}
                locale="fr"
                months={MONTHS}
                weekdaysLong={WEEKDAYS_LONG}
                weekdaysShort={WEEKDAYS_SHORT}
                firstDayOfWeek={1}
            />
        </Form.Group>
    );
}

export function DateTimePickerField( { label, ...props } :any) {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField<Date>(props);
    return (
        <Form.Group>
            <Form.Label>{label}</Form.Label>
            <DayPicker
                {...field}
                initialMonth={field.value}
                selectedDays={field.value}
                onDayClick={day => {
                    const newDate = new Date(field.value)
                    newDate.setFullYear(day.getFullYear(), day.getMonth(), day.getDate())
                    setFieldValue(field.name, newDate)
                }}
                locale="fr"
                months={MONTHS}
                weekdaysLong={WEEKDAYS_LONG}
                weekdaysShort={WEEKDAYS_SHORT}
                firstDayOfWeek={1}
                disabledDays={props.fromNow ? { before: new Date() }:{before: new Date(0)}}
            />
            <Form.Row>
                <Col>
                    <Form.Control
                        as={'select'}
                        custom
                        size={'sm'}
                        value={field.value.getHours().toString()}
                        onChange={(e) => {
                            const newDate = new Date(field.value);
                            newDate.setHours(parseInt(e.currentTarget.value));
                            setFieldValue(field.name, newDate)
                        }}
                    >
                        {HOURS.map((i) =>
                            <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>)
                        }
                    </Form.Control>
                </Col>
                :
                <Col>
                    <Form.Control
                        as={'select'}
                        custom
                        size={'sm'}
                        value={field.value.getMinutes().toString()}
                        onChange={(e) => {
                            const newDate = new Date(field.value);
                            newDate.setMinutes(parseInt(e.currentTarget.value));
                            setFieldValue(field.name, newDate)
                        }}
                    >
                        {MINUTES.map((i) =>
                            <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>)
                        }
                    </Form.Control>
                </Col>
            </Form.Row>
            {meta.touched && meta.error ? (
                <Form.Control.Feedback type="invalid">
                    {meta.error}
                </Form.Control.Feedback>
            ) : null}
        </Form.Group>
    )
}
