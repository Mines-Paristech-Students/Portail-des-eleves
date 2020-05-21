import React from "react";
import { FormCheck } from "react-bootstrap";

export const CheckboxField = ({ label, state, setState }) => (
    <label className="custom-control custom-checkbox">
        <FormCheck.Input
            className="custom-control-input"
            type="checkbox"
            checked={state}
            onChange={() => setState(!state)}
        />
        <span className="custom-control-label">{label}</span>
    </label>
);
