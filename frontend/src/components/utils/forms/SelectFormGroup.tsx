import React from "react";
import { BaseFormGroup, BaseFormGroupProps } from "./BaseFormGroup";
import { SelectGroup, SelectGroupProps } from "./SelectGroup";

/**
 * An array of `SelectGroupItem` with the same `name` and `type`, tied to Formik
 * fields, wrapped in a `.selectgroup` `div` and put in a `Form.Group`
 * component including optional `Form.Label`, `Form.Control.Feedback` and help
 * text components.
 *
 * @param name the name of the control, given to Formik's `useField`.
 * @param items the items in the group. Each item is an object with keys
 * `value`, `text`, `icon` and `children`. See `SelectGroupItem` to understand
 * how they are used. `className` is passed to the item `input` element.
 * @param type choose between `radio` and `checkbox`. Defaults to `radio`.
 * @param selectType choose between `inline`, `pills`, and `vertical`.
 * Defaults to `inline`.
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
 * @param props passed to `TextField`.
 */
export function SelectFormGroup({
    name,
    items,
    type,
    selectType = "inline",
    label,
    help,
    feedback = true,
    feedbackOnTouchedOnly = true,
    formGroupProps,
    labelProps,
    feedbackProps,
    ...props
}: BaseFormGroupProps & SelectGroupProps) {
    return (
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
            <SelectGroup
                name={name}
                type={type}
                items={items}
                selectType={selectType}
                {...props}
            />
        </BaseFormGroup>
    );
}
