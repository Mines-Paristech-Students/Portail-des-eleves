import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { SidebarOption, SidebarOptionField } from "./interfaces";
import { CheckboxField } from "./CheckboxField";
import { InputField } from "./InputField";
import Fuse from "fuse.js";
import { SidebarSection } from "./SidebarSection";

export const OptionSidebar = ({
    options,
}: {
    options: SidebarOption | null;
}) => {
    const [state, setState] = useState({});
    const [tagSearch, setTagSearch] = useState("");
    const [fuses, setFuses] = useState<Fuse<any, any>[]>([]);

    const computeKey = (section, field) => section.id + "." + field.id;
    const changeState = (key, value) => {
        let newState = { ...state };
        newState[key] = value;
        setState(newState);
        options?.notifyChange(newState);
    };

    useEffect(() => {
        setFuses(
            (options?.sections || []).map(
                (section) =>
                    new Fuse(section.fields, {
                        keys: ["label"],
                    })
            )
        );

        let defaultState = {};
        for (let i = 0; i < (options?.sections || []).length; i++) {
            let section = options!.sections[i];
            for (let field of section.fields) {
                defaultState[computeKey(section, field)] =
                    field.type == "checkbox"
                        ? field.defaultValue || false
                        : field.defaultValue || "";
            }
        }

        setState(defaultState);
    }, [options, tagSearch]);

    if (options === null || Object.keys(state).length === 0) {
        return null;
    }

    let displayedFields = 0;
    let sections = options.sections.map((section, i) => {
        let fields =
            tagSearch === ""
                ? section.fields
                : fuses[i].search(tagSearch).map((x) => x.item);

        displayedFields += fields.length;
        return (
            <SidebarSection
                key={section.id}
                computeKey={(field) => computeKey(section, field)}
                state={state}
                changeState={changeState}
                fields={fields}
                retractable={section.retractable}
                title={section.title}
                props={section.props}
                retractedByDefault={i > 1}
            />
        );
    });

    return (
        <div className={"mt-5 pt-5 border-top"}>
            {options.searchable && (
                <div className="input-icon mb-3">
                    <InputField
                        label={""}
                        placeholder="Rechercher un champ"
                        state={tagSearch}
                        setState={setTagSearch}
                        size={"sm"}
                        className={"mb-3"}
                    />
                    <span className="input-icon-addon">
                        <i className="fe fe-search" />
                    </span>
                </div>
            )}
            {sections}
            {displayedFields > 0 || (
                <p className="text-center">
                    <em>Aucun tag trouvé</em>
                </p>
            )}
        </div>
    );
};
