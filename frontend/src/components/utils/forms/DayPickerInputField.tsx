import React, { useEffect, useState } from "react";
import { FieldHookConfig, useField, useFormikContext } from "formik";
import dayjs from "dayjs";
import { dayPickerLocalisationProps } from "./DatePickerField";
import DayPickerInput from "react-day-picker/DayPickerInput";

// Required for formatting and parsing the date.
dayjs.extend(require("dayjs/plugin/customParseFormat"));

export type DayPickerInputFieldProps = {
    name: string;
    feedback?: boolean;
    parseFormats?: string | string[];
    displayFormat?: string;
    todayButton?: boolean;
    fieldProps?: string | FieldHookConfig<Date>;
};

/**
 * This component builds a bridge between `DayPickerInput` and Formik. The date time is always set at the beginning
 * of the day (00:00).
 *
 * The value of the field (accessible in `values[name]`) is always a Date object, but it may an `Invalid Date` object.
 *
 * You may also be interested in `DayPickerInputFormGroup` which puts this component in a `FormGroup`.
 *
 * Props:
 *     - name: the name of the control, used to access its value in Formik.
 *     - feedback: defaults to true. If `true`, the `is-invalid` class is given to the input component when needed.
 *     - parseFormats: defaults to `["DD/MM/YYYY"]`. The formats used to parse the date.
 *     - displayFormat: defaults to `"DD/MM/YYYY"`. The format used to display the date.
 *     - todayButton: defaults to `false`. If `true`, a `todayButton` will be displayed in the day picker.
 *     - fieldProps: passed to Formik's `useField`.
 */
export const DayPickerInputField = ({
    name,
    feedback = true,
    parseFormats = ["DD/MM/YYYY"],
    displayFormat = "DD/MM/YYYY",
    todayButton = false,
    ...fieldProps
}: DayPickerInputFieldProps) => {
    const [field, meta, helper] = useField<Date | undefined>({
        validate: (value) =>
            value === undefined ? "Date invalide" : undefined,
        ...fieldProps,
        name: name,
    });

    // Format a date to display in the input.
    const formatDate = (date) => dayjs(date).format(displayFormat);

    // Parse a date from the input.
    const parseDate = (dateString) => {
        // @ts-ignore: the ability to use a `string[]` as `format` was introduced in 1.8.27 and the types have not
        // been updated yet.
        const d = dayjs(dateString, parseFormats);

        // `undefined` is used when there is an invalid date.
        return d.isValid() ? d.toDate() : undefined;
    };

    // Called when the user types into the input field or when a day is clicked on the calendar.
    const handleDayChange = (selectedDay) => {
        if (selectedDay) {
            helper.setValue(dayjs(selectedDay).hour(0).minute(0).toDate());
        } else {
            helper.setValue(undefined);
        }
    };

    return (
        <>
            <DayPickerInput
                value={field.value}
                formatDate={formatDate}
                parseDate={parseDate}
                onDayChange={handleDayChange}
                dayPickerProps={{
                    month: field.value,
                    selectedDays: field.value,
                    ...dayPickerLocalisationProps(todayButton),
                }}
                inputProps={{
                    className: `form-control ${
                        feedback && meta.error ? "is-invalid" : ""
                    }`,
                    placeholder: "JJ/MM/YYYY",
                    ...field,
                }}
            />
        </>
    );
};
