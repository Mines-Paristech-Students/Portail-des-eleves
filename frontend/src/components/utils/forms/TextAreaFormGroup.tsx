import React from "react";
import { useField } from "formik";
import Form from "react-bootstrap/Form";

/**
 * This component creates a Formik field and ties it to a `textarea` component.
 *
 * Use it inside a Formik context like this:
 * ```
 * <TextAreaFormGroup
 *     label="Label"
 *     name="myInput"
 *     placeholder="Some placeholder"
 * />
 * ```
 *
 * @param name the name of the textarea, used to retrieve the value in Formik.
 * @param label the label of the textarea.
 * @param props passed to `useField`.
 */
export const TextAreaFormGroup = ({
    name,
    label,
    ...props
}: {
    name: string;
    label: string;
    [key: string]: any;
}) => {
    const [field, meta] = useField({
        name: name,
        ...props,
    });

    return (
        <Form.Group controlId={props.id || props.name}>
            <Form.Label>{label}</Form.Label>

            <Form.Control
                {...field}
                {...props}
                as="textarea"
                isInvalid={!!meta.error && meta.touched}
            />

            {meta.touched && meta.error && (
                <Form.Control.Feedback type="invalid" className={"d-block"}>
                    {meta.error}
                </Form.Control.Feedback>
            )}
        </Form.Group>
    );
};
