import React from "react";
import { FormCheck } from "react-bootstrap";

/**
 * Utility function useful for updating array states where each item is supposed
 * to be managed by one checkbox.
 *
 * If the checkbox is checked, return `oldStatus` updated to include `value`.
 * If it is uncheckd, return `oldStatus` updated to exclude `value`.
 *
 * For instance, suppose the status is an array which may contain at most the
 * items: `["BORROWED", "AVAILABLE", "REQUESTED"]`.
 *
 * One may use this snippet to update `BORROWED`:
 *
 * ```
 * <CheckboxField
 * label={"Prêtés"}
 *   state={status.includes("BORROWED")}
 *   onChange={(checked) =>
 *     setStatus((oldStatus) => updateStatus(checked, "BORROWED", oldStatus))
 *   }
 * />
 * ```
 *
 * @param checked `true` if the checkbox is checked. Given by `ChecboxField`'s
 * `onChange`.
 * @param value the item which needs to be updated in the status array.
 * @param oldStatus the array status to update.
 */
export function updateStatus<T>(checked: boolean, value: T, oldStatus: T[]) {
  return checked ? [...oldStatus, value] : oldStatus.filter((x) => x !== value);
}

export const CheckboxField = ({ label, state, onChange }) => (
  <label className="custom-control custom-checkbox">
    <FormCheck.Input
      className="custom-control-input"
      type="checkbox"
      checked={state}
      onChange={() => onChange(!state)}
    />
    <span className="custom-control-label">{label}</span>
  </label>
);
