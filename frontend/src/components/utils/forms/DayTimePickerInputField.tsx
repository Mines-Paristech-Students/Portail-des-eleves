import { dayPickerLocalisationProps } from "./DatePickerField";
import dayjs from "dayjs";
import React from "react";
import { useField } from "formik";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { DayPickerInputFieldProps } from "./DayPickerInputField";

dayjs.extend(require("dayjs/plugin/customParseFormat"));

/**
 * This component builds a bridge between `DayPickerInput` and Formik, and make `DayPickerInput` accepts time.
 *
 * You may also be interested in `DayTimePickerInputFormGroup` which puts this component in a `FormGroup`.
 *
 * Props:
 *     - name: the name of the control, used to access its value in Formik.
 *     - feedback: defaults to true. If `true`, the `is-invalid` class is given to the input component when needed.
 *     - parseFormats: defaults to `["DD/MM/YYYY HH:mm"]`. The formats used to parse the date time.
 *     - displayFormat: defaults to `"DD/MM/YYYY HH:mm"`. The format used to display the date time.
 *     - todayButton: defaults to `false`. If `true`, a `todayButton` will be displayed in the day picker.
 *     - fieldProps: passed to Formik's `useField`.
 */
export const DayTimePickerInputField = ({
    name,
    feedback = true,
    parseFormats = ["DD/MM/YYYY HH:mm"],
    displayFormat = "DD/MM/YYYY HH:mm",
    todayButton = false,
    ...fieldProps
}: DayPickerInputFieldProps) => {
    const [field, meta, helper] = useField<Date | undefined>({
        validate: (value) =>
            value === undefined
                ? "Veuillez entrer une date et une heure au format JJ/MM/YYYY hh:mm"
                : undefined,
        ...fieldProps,
        name: name,
    });

    // Format a date to display in the input.
    const formatDate = (date) => dayjs(date).format(displayFormat);

    return (
        <>
            <DayPickerInput
                value={field.value}
                formatDate={formatDate}
                dayPickerProps={{
                    ...dayPickerLocalisationProps(todayButton),
                    month: field.value,
                    selectedDays: field.value,
                    onDayClick: (date) =>
                        helper.setValue(
                            dayjs(date)
                                .hour(field.value ? field.value.getHours() : 0)
                                .minute(
                                    field.value ? field.value.getMinutes() : 0
                                )
                                .toDate()
                        ),
                }}
                inputProps={{
                    className: `form-control ${
                        feedback && meta.error ? "is-invalid" : ""
                    }`,
                    placeholder: "JJ/MM/YYYY hh:mm",
                    // Adding Formik's `onChange` will make everything buggy, because Formik will sometimes set
                    // `field.value` to the _string_ value of the input, bypassing `react-day-picker`'s flow.
                    onBlur: field.onBlur,
                    onChange: (event) => {
                        // @ts-ignore: the ability to use a `string[]` as `format` was introduced in 1.8.27 and the types
                        // have not been updated yet. Also, the third parameter actually deals with the strict mode if
                        // it's a boolean.
                        const d = dayjs(event.target.value, parseFormats, true);
                        helper.setValue(d.isValid() ? d.toDate() : undefined);
                    },
                }}
            />
        </>
    );
};
