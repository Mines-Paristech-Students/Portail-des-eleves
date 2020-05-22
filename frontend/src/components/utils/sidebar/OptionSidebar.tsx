import React, { useEffect, useState } from "react";
import { SidebarOption } from "./interfaces";
import { InputField } from "./InputField";
import Fuse from "fuse.js";
import { SidebarSection } from "./SidebarSection";

/**
 * Component for displaying additional options in the sidebar of a page such as
 * in Association pages. To use it, give it a SidebarOption object
 *
 * interface SidebarOption {
 *   notifyChange: callback when the inputs change;
 *   searchable?: display a search field on the top to look for specific field.
 *                The search is based on their label
 *   sections: {
 *       title: the name of the section
 *       id: an id (used for React `key` propp)
 *       retractable: if True, the user will be able to hide the section
 *       props?: additional properties to be given to the section html parent
 *       fields: The fields in the section. Currently only
 *               checkbox (`SidebarOptionCheckField`) and
 *               text input (`SidebarOptionInputField`) are supported
 *   }[];
}
 *
 */
export const OptionSidebar = ({
    options,
}: {
    options: SidebarOption | null;
}) => {
    const [inputsState, setInputsState] = useState({});
    const [fieldSearch, setFieldSearch] = useState("");
    const [fuses, setFuses] = useState<Fuse<any, any>[]>([]);

    const computeKey = (section, field) => section.id + "." + field.id;
    const changeState = (key, value) => {
        let newState = { ...inputsState };
        newState[key] = value;
        setInputsState(newState);
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
                    field.type === "checkbox"
                        ? field.defaultValue || false
                        : field.defaultValue || "";
            }
        }

        setInputsState(defaultState);
    }, [options, fieldSearch]);

    if (options === null || Object.keys(inputsState).length === 0) {
        return null;
    }

    let numberOfDisplayedFields = 0;
    const sections = options.sections.map((section, i) => {
        let fields =
            fieldSearch === ""
                ? section.fields
                : fuses[i].search(fieldSearch).map((x) => x.item);

        numberOfDisplayedFields += fields.length;
        return (
            <SidebarSection
                key={section.id}
                computeKey={(field) => computeKey(section, field)}
                state={inputsState}
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
                        state={fieldSearch}
                        setState={setFieldSearch}
                        size={"sm"}
                        className={"mb-3"}
                    />
                    <span className="input-icon-addon">
                        <i className="fe fe-search" />
                    </span>
                </div>
            )}
            {sections}
            {numberOfDisplayedFields > 0 || (
                <p className="text-center">
                    <em>Aucun tag trouvé</em>
                </p>
            )}
        </div>
    );
};
