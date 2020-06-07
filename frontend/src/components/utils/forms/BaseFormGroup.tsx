import React from "react";
import Form from "react-bootstrap/Form";
import { useFormikContext } from "formik";

export type BaseFormGroupProps = {
    name: string;
    label?: string;
    help?: string | JSX.Element;
    feedback?: boolean;
    feedbackOnTouchedOnly?: boolean;
    formGroupProps?: any;
    labelProps?: any;
    feedbackProps?: any;
};

/**
 * A base component wrapping its `children` in a `Form.Group` component.
 * Also includes optional `Form.Label`, `Form.Control.Feedback` and help text
 * components.
 * The `children` is usually a component using the Formik `Field` logic.
 *
 * @param name the name of the control, used for getting the error in the Formik
 * context.
 * @param label optional, the label of the form control.
 * @param help optional, a text to display below the form control.
 * @param feedback defaults to `true`. If `true`, a `Form.Control.Feedback` is
 * displayed and filled with the errors obtained from the Formik context.
 * @param feedbackOnTouchedOnly defaults to `true`. If `true`, the feedback
 * is only displayed if the field is touched.
 * @param formGroupProps passed to the `Form.Group` component.
 * @param labelProps passed to the `Form.Label` component.
 * @param feedbackProps passed to the `Form.Control.Feedback` component.
 * @param children displayed between the label (if any) and the feedback
 * (if any).
 */
export const BaseFormGroup = ({
    name,
    label,
    help,
    feedback = true,
    feedbackOnTouchedOnly = true,
    formGroupProps,
    labelProps,
    feedbackProps,
    children,
}: BaseFormGroupProps & { children: any }) => {
    const { touched, errors } = useFormikContext();

    return (
        <Form.Group controlId={name} {...formGroupProps}>
            {label && <Form.Label {...labelProps}>{label}</Form.Label>}

            {children}

            {help && <p className="form-text text-muted small mb-0">{help}</p>}

            {feedback &&
                (touched[name] || !feedbackOnTouchedOnly) &&
                errors[name] && (
                    // Display block is required to show it with an icon
                    // https://stackoverflow.com/questions/50431450/force-to-show-invalid-feedback-in-bootstrap-4
                    <Form.Control.Feedback
                        type="invalid"
                        className="d-block"
                        {...feedbackProps}
                    >
                        {errors[name]}
                    </Form.Control.Feedback>
                )}
        </Form.Group>
    );
};
