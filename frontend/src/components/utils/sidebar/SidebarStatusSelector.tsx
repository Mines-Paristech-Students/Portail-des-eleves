import React, { useEffect } from "react";
import { SidebarSection } from "./SidebarSection";
import { CheckboxField } from "./CheckboxField";
import { useURLState } from "../../../utils/useURLState";

/**
 * `SidebarStatusSelector` is a sidebar component to search transactions with
 * a particular status in the sidebar. Its architecture is the same as
 * `TagSearch`
 * @param setParams a useState setter to change the query parameters
 * @param statuses all possible status to search for, in the form of a
 * {value, label} array
 * @param defaultState  an object with all values and their default state as
 * a boolean
 * @param queryKey the status field name in the server side API
 */
export const SidebarStatusSelector = ({
  setParams,
  statuses,
  defaultState,
  queryKey = "status__in",
}: {
  setParams: (object) => void;
  statuses: { value: string; label: string }[];
  defaultState: any; //([key: string]: boolean);
  queryKey?: string;
}) => {
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
      [queryKey]: Object.entries(checkboxState)
        .map(([key, value]) => (value ? key : false))
        .filter(Boolean)
        .join(","),
    });
  }, [checkboxState, setParams, queryKey]);

  return (
    <SidebarSection
      retractable={true}
      title="Statut"
      retractedByDefault={false}
    >
      {statuses.map(({ value, label }) => (
        <CheckboxField
          label={label}
          state={checkboxState[value]}
          onChange={(checked) =>
            setCheckboxState((state) => ({
              ...state,
              value: checked,
            }))
          }
          key={value}
        />
      ))}
    </SidebarSection>
  );
};
