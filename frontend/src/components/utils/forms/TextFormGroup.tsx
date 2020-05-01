import React from "react";
import { useField } from "formik";
import Form from "react-bootstrap/Form";

/**
 * This component encapsulates the Formik logic into a React Bootstrap <Form.Group> component. Use it like this:
 * ```
 *     <Formik.Form>
 *         <TextFormGroup
 *             label="Label"
 *             name="myInput"
 *             type="text" | "email" | "password" | ...
 *             placeholder="Some placeholder"
 *         />
 *     </Formik.Form>
 * ```
 */
export function TextFormGroup({ label, ...props }: any) {
    const [field, meta] = useField(props);

    return (
        <Form.Group controlId={props.id || props.name}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                {...field}
                {...props}
                isInvalid={meta.touched && meta.error}
            />
            {meta.touched && meta.error ? (
                <Form.Control.Feedback type="invalid">
                    {meta.error}
                </Form.Control.Feedback>
            ) : null}
        </Form.Group>
    );
}
