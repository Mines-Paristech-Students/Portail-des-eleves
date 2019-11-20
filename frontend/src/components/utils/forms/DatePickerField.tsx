import React from 'react';
import {useField, useFormikContext} from "formik";
import DatePicker from "react-datepicker";
import {registerLocale, setDefaultLocale} from "react-datepicker";
import fr from 'date-fns/locale/fr';
import Form from "react-bootstrap/Form";
import "react-datepicker/dist/react-datepicker.css";


// TODO: use https://github.com/airbnb/react-dates.
export function DatePickerField({label, ...props}: any) {
    const {setFieldValue} = useFormikContext();
    const [field, meta] = useField(props);

    registerLocale('fr', fr);

    return (
        <Form.Group>
            <Form.Label>{label}</Form.Label>
            <DatePicker
                {...field}
                {...props}
                className="form-control"
                showPopperArrow={false}
                locale="fr"
                dateFormat="dd/MM/yyyy"
                selected={(field.value && new Date(field.value)) || null}
                onChange={val => {
                    setFieldValue(field.name as never, val);
                }}
                todayButton="Aujourd’hui"
            />
            {meta.touched && meta.error ? (
                <Form.Control.Feedback type="invalid">
                    {meta.error}
                </Form.Control.Feedback>
            ) : null}
        </Form.Group>
    );
}
