import React, { useEffect } from "react";
import { SidebarSection } from "../../utils/sidebar/SidebarSection";
import { CheckboxField } from "../../utils/sidebar/CheckboxField";
import { useURLState } from "../../../utils/useURLState";

/**
 * `SidebarStatusSelector` is a sidebar compoenent to search transactions with
 * a particular status in the sidebar. Its architecture is the same as
 * `TagSearch`
 * @param setParams a useState setter to change the query parameters
 */
export const SidebarStatusSelector = ({ setParams }) => {
    const [checkboxState, setCheckboxState] = useURLState(
        "status",
        defaultState,
        (data) =>
            Object.entries(data)
                .map(([key, value]) => (value ? key : false))
                .filter(Boolean)
                .join("-"),
        (data) => {
            let state = { ...defaultState };
            data.split("-").forEach((value) => (state[value] = true));
            return state;
        }
    );

    useEffect(() => {
        setParams({
            status__in: Object.entries(checkboxState)
                .map(([key, value]) => (value ? key : false))
                .filter(Boolean)
                .join(","),
        });
    }, [checkboxState, setParams]);

    return (
        <SidebarSection
            retractable={true}
            title="Statut"
            retractedByDefault={false}
        >
            {orderStatus.map(({ value, label }) => (
                <CheckboxField
                    label={label}
                    state={checkboxState}
                    setState={setCheckboxState}
                    id={value}
                    key={value}
                />
            ))}
        </SidebarSection>
    );
};

const orderStatus = [
    { value: "ORDERED", label: "Commandé" },
    { value: "CANCELLED", label: "Annulé" },
    { value: "REJECTED", label: "Refusé" },
    { value: "VALIDATED", label: "Validé" },
    { value: "DELIVERED", label: "Transmis" },
    { value: "REFUNDED", label: "Remboursé" },
];

const defaultState = {
    ORDERED: false,
    CANCELLED: false,
    REJECTED: false,
    VALIDATED: false,
    DELIVERED: false,
    REFUNDED: false,
};
