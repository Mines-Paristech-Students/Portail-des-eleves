import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { SidebarOption } from "./interfaces";
import { CheckboxField } from "./CheckboxField";
import { InputField } from "./InputField";

export const OptionSidebar = ({
    options,
}: {
    options: SidebarOption | null;
}) => {
    const [state, setState] = useState({});

    const computeKey = (section, field) => section.id + "." + field.id;
    const changeState = (key, value) => {
        let newState = { ...state };
        newState[key] = value;
        setState(newState);
        options?.notifyChange(newState);
    };

    useEffect(() => {
        let defaultState = {};
        for (let section of options?.sections || []) {
            for (let field of section.fields) {
                defaultState[computeKey(section, field)] =
                    field.type == "checkbox"
                        ? field.defaultValue || false
                        : field.defaultValue || "";
            }
        }

        setState(defaultState);
    }, [options]);

    if (options === null || Object.keys(state).length === 0) {
        return null;
    }

    return (
        <div className={"mt-5 pt-5 border-top"}>
            {options.sections.map((section) => (
                <SidebarSection
                    key={section.id}
                    section={section}
                    computeKey={computeKey}
                    state={state}
                    changeState={changeState}
                />
            ))}
        </div>
    );
};

const SidebarSection = ({ section, computeKey, state, changeState }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <Form.Group {...section.props}>
            <Form.Label
                className="text-uppercase"
                onClick={() => {
                    setIsOpen(!isOpen);
                }}
            >
                {section.retractable && (
                    <span
                        className={`float-right pt-1 fe ${
                            isOpen ? "fe-chevron-up" : "fe-chevron-down"
                        }`}
                    />
                )}
                {section.title}
            </Form.Label>

            {isOpen &&
                section.fields.map((field) => {
                    const key = computeKey(section, field);
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
