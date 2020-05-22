import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { CheckboxField } from "./CheckboxField";
import { InputField } from "./InputField";

export const SidebarSection = ({
    computeKey,
    state,
    changeState,
    fields,
    retractable,
    title,
    props,
    retractedByDefault,
}) => {
    const [isRetracted, setIsRetracted] = useState(false);

    useEffect(() => {
        setIsRetracted(retractedByDefault);
        // eslint-disable-next-line
    }, []);

    if (fields.length === 0) {
        return null;
    }

    return (
        <Form.Group {...props}>
            <Form.Label
                className="text-uppercase"
                onClick={() => {
                    setIsRetracted(!isRetracted);
                }}
            >
                {retractable && (
                    <span
                        className={`float-right pt-1 fe ${
                            isRetracted ? "fe-chevron-up" : "fe-chevron-down"
                        }`}
                    />
                )}
                {title}
            </Form.Label>

            {!isRetracted &&
                fields.map((field) => {
                    const key = computeKey(field);
                    const commonProps = {
                        key: key,
                        label: field.label,
                        state: state[key],
                        setState: (value) => changeState(key, value),
                    };

                    return (
                        (field.type === "checkbox" && (
                            <CheckboxField {...commonProps} />
                        )) ||
                        (field.type === "text" && (
                            <InputField
                                placeholder={field.placeholder}
                                {...commonProps}
                            />
                        ))
                    );
                })}
        </Form.Group>
    );
};