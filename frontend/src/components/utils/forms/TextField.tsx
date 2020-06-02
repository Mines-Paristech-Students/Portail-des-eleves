import React from "react";
import { FieldAttributes, useField } from "formik";
import Form from "react-bootstrap/Form";

export type TextFieldProps = {
    name: string;
    feedback?: boolean;
    feedbackOnTouchedOnly?: boolean;
    iconLeft?: string;
    iconRight?: string;
    textLeft?: string;
    textRight?: string;
} & FieldAttributes<any>;

/**
 * A `Form.Control` component tied to a Formik field.
 *
 * @param name the name of the control, given to Formik's `useField`.
 * @param feedback defaults to `true`. If `true`, the input will be given the
 * `isInvalid` props when needed.
 * @param feedbackOnTouchedOnly defaults to `true`. If `true`, the feedback
 * is only displayed if the field is touched.
 * @param iconLeft optional, the code of a Feather icon embedded on the left
 * of the input. If this prop is specified, `textLeft` and `textRight` are
 * ignored.
 * @param iconRight optional, the code of a Feather icon embedded on the right
 * of the input. If this prop is specified, `textLeft` and `textRight` are
 * ignored.
 * @param textLeft optional, a text embedded on the left of the input.
 * @param textRight optional, a text embedded on the right of the input.
 * @param props passed to `useField` and `Form.Control`.
 */
export const TextField = ({
    name,
    feedback = true,
    feedbackOnTouchedOnly = true,
    iconLeft,
    iconRight,
    textLeft,
    textRight,
    ...props
}: TextFieldProps) => {
    const [field, meta] = useField({ name: name, ...props });

    const control = (
        <Form.Control
            {...field}
            {...props}
            isInvalid={
                feedback &&
                (meta.touched || !feedbackOnTouchedOnly) &&
                !!meta.error
            }
        />
    );

    return iconLeft || iconRight ? (
        <div className="input-icon">
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
    ) : textLeft || textRight ? (
        <div className="input-group">
            {textLeft && (
                <div className="input-group-prepend">
                    <span className="input-group-text">{textLeft}</span>
                </div>
            )}
            {control}
            {textRight && (
                <div className="input-group-append">
                    <span className="input-group-text">{textRight}</span>
                </div>
            )}
        </div>
    ) : (
        control
    );
};
