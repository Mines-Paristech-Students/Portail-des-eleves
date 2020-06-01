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
 *
 * @param name The name of the input.
 * @param label Optional. The label of the form group.
 * @param help Optional. A help text displayed below the input.
 * @param iconLeft Optional. The Feather icon to display on the left.
 * @param iconRight Optional. The Feather icon to display on the right.
 * @param textRight Optional. Some text to display on the right.
 * @param props Passed to `useField` and `Form.Control`.
 */
export function TextFormGroup({
    name,
    label,
    help,
    iconLeft = null,
    iconRight = null,
    textRight = null,
    ...props
}: {
    name: string;
    label?: string;
    help?: string;
    iconLeft?: string | null;
    iconRight?: string | null;
    textRight?: string | null;
    [key: string]: any;
}) {
    const [field, meta] = useField({
        name: name,
        ...props,
    });
    const control = (
        <Form.Control
            {...field}
            {...props}
            isInvalid={meta.touched && !!meta.error}
        />
    );

    return (
        <Form.Group controlId={props.id || props.name}>
            {label && <Form.Label>{label}</Form.Label>}

            {iconLeft || iconRight ? (
                <div className={"input-icon"}>
                    {iconLeft && (
                        <span className="input-icon-addon">
                            <i className={`fe fe-${iconLeft}`} />
                        </span>
                    )}
                    {control}
                    {iconRight && (
                        <span className="input-icon-addon">
                            <i className={`fe fe-${iconRight}`} />
                        </span>
                    )}
                </div>
            ) : textRight ? (
                <div className="input-group">
                    {control}
                    <div className="input-group-append">
                        <span className="input-group-text">{textRight}</span>
                    </div>
                </div>
            ) : (
                control
            )}

            {help && <p className="form-text text-muted small mb-0">{help}</p>}

            {meta.touched && meta.error ? (
                // Display block is required to show it with an icon
                // https://stackoverflow.com/questions/50431450/force-to-show-invalid-feedback-in-bootstrap-4
                <Form.Control.Feedback type="invalid" className={"d-block"}>
                    {meta.error}
                </Form.Control.Feedback>
            ) : null}
        </Form.Group>
    );
}
