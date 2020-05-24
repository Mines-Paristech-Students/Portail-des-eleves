import { useField } from "formik";
import React from "react";

export const SwitchCheckbox = ({ children, name, ...props }) => {
    const [field, meta] = useField({
        ...props,
        name: name,
        type: "checkbox",
    });
    return (
        <>
            <label className={"col mt-3"}>
                <input
                    type="checkbox"
                    className="custom-switch-input"
                    {...field}
                    {...props}
                />
                <span className="custom-switch-indicator" />
                <span className="custom-switch-description">{children}</span>
            </label>
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    );
};
