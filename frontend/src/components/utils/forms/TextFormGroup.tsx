import React from "react";
import { BaseFormGroup, BaseFormGroupProps } from "./BaseFormGroup";
import { TextField, TextFieldProps } from "./TextField";

/**
 * A `Form.Control` component tied to a Formik field, wrapped in a `Form.Group`
 * component including optional `Form.Label` and `Form.Control.Feedback`
 * components.
 *
 * Basic example:
 * ```
 * <TextFormGroup
 *     name="email"
 *     type="email"
 *     label="Courriel"
 * />
 * ```
 *
 * Some graphical additions:
 * ```
 * <TextFormGroup
 *     name="description"
 *     as="textarea"
 *     label="Description"
 *     placeholder="Ma vie super intéressante"
 *     iconLeft="edit-2"
 *     labelProps={{
 *         className: "font-weight-normal"
 *     }}
 * />
 * ```
 *
 * @param name the name of the control, given to Formik's `useField`.
 * @param label optional, the label of the form control.
 * @param feedback defaults to `true`. If `true`, the input will be given the
 * `isInvalid` props when needed and a `Form.Control.Feedback` is
 * displayed and filled with the errors obtained from the Formik context.
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
 * @param formGroupProps passed to the `Form.Group` component.
 * @param labelProps passed to the `Form.Label` component.
 * @param feedbackProps passed to the `Form.Control.Feedback` component.
 * @param props passed to `useField` and `Form.Control`.
 */
export const TextFormGroup = ({
    name,
    label,
    feedback = true,
    feedbackOnTouchedOnly = true,
    iconLeft,
    iconRight,
    textLeft,
    textRight,
    formGroupProps,
    labelProps,
    feedbackProps,
    ...props
}: TextFieldProps & BaseFormGroupProps) => (
    <BaseFormGroup
        name={name}
        label={label}
        feedback={feedback}
        feedbackOnTouchedOnly={feedbackOnTouchedOnly}
        formGroupProps={formGroupProps}
        labelProps={labelProps}
        feedbackProps={feedbackProps}
    >
        <TextField
            name={name}
            feedback={feedback}
            feedbackOnTouchedOnly={feedbackOnTouchedOnly}
            iconLeft={iconLeft}
            iconRight={iconRight}
            textLeft={textLeft}
            textRight={textRight}
            {...props}
        />
    </BaseFormGroup>
);
