import React from "react";
import { FormCheck } from "react-bootstrap";

/**
 * Return a status array updated to include `value` if `checked`, excluding
 * `value` otherwise. Useful with `CheckboxField`:
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
