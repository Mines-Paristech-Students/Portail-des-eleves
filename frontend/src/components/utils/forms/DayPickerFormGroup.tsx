import React from "react";
import { BaseFormGroup, BaseFormGroupProps } from "./BaseFormGroup";
import { DayPickerField, DatePickerFieldProps } from "./DayPickerField";

/**
 * A `DayPicker` component tied to a Formik field, wrapped in a `Form.Group`
 * component including optional `Form.Label`, `Form.Control.Feedback` and help
 * text components.
 *
 * Basic example:
 * ```
 * <DatePickerFormGroup
 *     name="birthday"
 *     label="Date de naissance"
 * />
 * ```
 *
 * Some graphical additions:
 * ```
 * <DatePickerFormGroup
 *     name="birthday"
 *     label="Date de naissance"
 *     todayButton
 *     labelProps={{
 *         className: "font-weight-normal"
 *     }}
 * />
 * ```
 *
 * @param name the name of the control, given to Formik's `useField`.
 * @param label optional, the label of the form control.
 * @param help optional, a text to display below the form control.
 * @param feedback defaults to `true`. If `true`, the input will be given the
 * `isInvalid` props when needed and a `Form.Control.Feedback` is
 * displayed and filled with the errors obtained from the Formik context.
 * @param feedbackOnTouchedOnly defaults to `true`. If `true`, the feedback
 * is only displayed if the field is touched.
 * @param todayButton defaults to `false`. If `true`, a “Today” button is displayed.
 * @param formGroupProps passed to the `Form.Group` component.
 * @param labelProps passed to the `Form.Label` component.
 * @param feedbackProps passed to the `Form.Control.Feedback` component.
 * @param props passed to `DayPickerField`.
 */
export const DayPickerFormGroup = ({
    name,
    label,
    help,
    feedback = true,
    feedbackOnTouchedOnly = true,
    todayButton = false,
    formGroupProps,
    labelProps,
    feedbackProps,
    ...props
}: DatePickerFieldProps & BaseFormGroupProps) => (
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
        <DayPickerField name={name} todayButton={todayButton} {...props} />
    </BaseFormGroup>
);
