import React from "react";
import { DayPickerInputFieldProps } from "./DayPickerInputField";
import { DayTimePickerInputField } from "./DayTimePickerInputField";
import { BaseFormGroup, BaseFormGroupProps } from "./BaseFormGroup";

/**
 * A `DayPickerInput` component also accepting time and tied to a Formik field,
 * wrapped in a `Form.Group` component including optional `Form.Label`,
 * `Form.Control.Feedback` and help text components.
 *
 * The value of the field (accessible in `values[name]`) is a `Date` object or
 * `undefined` if the `Date` is invalid (i.e. when the input contains something
 * which could not be parsed).
 *
 * Please note that due to an unexplained behaviour of Formik when clicking on
 * Submit several times in a row, the condition for showing the feedback is that
 * `errors[name]` is set and `feedback` is true (`touched` has thus no effect).
 *
 * @param name the name of the control, used to access its value in Formik.
 * @param label optional, the label to display.
 * @param help optional, a text to display below the form control.
 * @param feedback defaults to true. If `true`, the input will be given the
 * `isInvalid` props when needed and a `Form.Control.Feedback` is
 * displayed and filled with the errors obtained from the Formik context.
 * @param disabled defaults to `false`. If `true`, the input is disabled.
 * @param parseFormats defaults to `["DD/MM/YYYY"]`. The formats used to parse
 * the date.
 * @param displayFormat defaults to `"DD/MM/YYYY"`. The format used to display
 * the date.
 * @param todayButton defaults to `false`. If `true`, a `todayButton` will be
 * displayed in the day picker.
 * @param formGroupProps passed to the `Form.Group` component.
 * @param labelProps passed to the `Form.Label` component.
 * @param feedbackProps passed to the `Form.Control.Feedback` component.
 * @param props passed to `DayTimePickerInputField`.
 */
export const DayTimePickerInputFormGroup = ({
    name,
    label,
    help,
    feedback = true,
    disabled = false,
    parseFormats = ["DD/MM/YYYY HH:mm"],
    displayFormat = "DD/MM/YYYY HH:mm",
    todayButton = false,
    formGroupProps,
    labelProps,
    feedbackProps,
    props,
}: DayPickerInputFieldProps & BaseFormGroupProps) => (
    <BaseFormGroup
        name={name}
        label={label}
        help={help}
        feedback={feedback}
        feedbackOnTouchedOnly={false}
        formGroupProps={formGroupProps}
        labelProps={labelProps}
        feedbackProps={feedbackProps}
    >
        <DayTimePickerInputField
            name={name}
            feedback={feedback}
            disabled={disabled}
            parseFormats={parseFormats}
            displayFormat={displayFormat}
            todayButton={todayButton}
            {...props}
        />
    </BaseFormGroup>
);
