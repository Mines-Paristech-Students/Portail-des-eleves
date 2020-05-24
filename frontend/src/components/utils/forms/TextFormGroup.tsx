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
export function TextFormGroup({
    label,
    iconLeft = null,
    iconRight = null,
    textRight = null,
    ...props
}: any) {
    const [field, meta] = useField(props);
    const control = (
        <Form.Control
            {...field}
            {...props}
            isInvalid={meta.touched && meta.error}
        />
    );

    return (
        <Form.Group controlId={props.id || props.name}>
            <Form.Label>{label}</Form.Label>

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
