import React from "react";
import { BaseFormGroup, BaseFormGroupProps } from "./BaseFormGroup";
import { SelectUserField, SelectUserFieldProps } from "./SelectUserField";

/**
 * A react-select `Select` component allowing to select an user, tied to a
 * Formik field, and wrapped in a `Form.Group` component including optional
 * `Form.Label`, `Form.Control.Feedback` and help text components.
 *
 * The Formik field's value follows the react-select format: an object (or array
 * of objects) `{ value, label }`. This should be taken into account when
 * filling `defaultValues`.
 *
 * @param name the name of the control, given to Formik's `useField`.
 * @param isMulti defaults to `false`. If `true`, several users may be selected.
 * @param label optional, the label of the form control.
 * @param help optional, a text to display below the form control.
 * @param feedback defaults to `true`. If `true`, the input will be given the
 * `isInvalid` props when needed and a `Form.Control.Feedback` is
 * displayed and filled with the errors obtained from the Formik context.
 * @param feedbackOnTouchedOnly defaults to `true`. If `true`, the feedback
 * is only displayed if the field is touched.
 * @param formGroupProps passed to the `Form.Group` component.
 * @param labelProps passed to the `Form.Label` component.
 * @param feedbackProps passed to the `Form.Control.Feedback` component.
 * @param props passed to `SelectUserField`.
 */
export const SelectUserFormGroup = ({
    name,
    isMulti = false,
    label,
    help,
    feedback = true,
    feedbackOnTouchedOnly = true,
    formGroupProps,
    labelProps,
    feedbackProps,
    ...props
}: SelectUserFieldProps & BaseFormGroupProps) => (
    <BaseFormGroup
        name={name}
        label={label}
        help={help}
        feedback={feedback}
        feedbackOnTouchedOnly={feedbackOnTouchedOnly}
        formGroupProps={formGroupProps}
        labelProps={labelProps}
        feedbackProps={feedbackProps}
    >
        <SelectUserField
            name={name}
            feedback={feedback}
            feedbackOnTouchedOnly={feedbackOnTouchedOnly}
            isMulti={isMulti}
            {...props}
        />
    </BaseFormGroup>
);
