import React from "react";
import { FieldAttributes, useField } from "formik";

/**
 * An item of a `SelectGroup` tied to a Formik field.
 *
 * Props `text` and `icon` allow to render it as an icon button or a text
 * button; the rendering may also be completely personalized with `children`.
 * If several of these props are specified, `children` has the priority over
 * `text` and `text` has the priority over `icon`.
 * If none of these props are specified, the button is filled with `value`.
 *
 * @param name the name of the control, given to Formik's `useField`.
 * @param value the value of the item (found in Formik's values).
 * @param type choose between `radio` and `checkbox`. Defaults to `radio`.
 * @param text optional. Used to render the button.
 * @param icon optional. A Feather icon used to render the button.
 * @param children optional. Used to render the button.
 * @param props passed to `useField` and the `input` element.
 */
export const SelectGroupItem = ({
    name,
    value,
    type = "radio",
    text,
    icon,
    children,
    ...props
}: {
    name: string;
    value: string;
    type: "radio" | "checkbox";
    text?: string;
    icon?: string;
    children?: any;
} & FieldAttributes<any>) => {
    const [field] = useField({
        name: name,
        value: value,
        type: type,
        ...props,
    });

    return (
        <label className="selectgroup-item">
            <input
                {...field}
                {...props}
                className={`${props.className || ""} selectgroup-input`}
                type={type}
            />
            {children ? (
                children
            ) : (
                <span className="selectgroup-button">
                    {" "}
                    {text ? (
                        text
                    ) : icon ? (
                        <i className={`fe fe-${icon}`} />
                    ) : (
                        value
                    )}
                </span>
            )}
        </label>
    );
};
