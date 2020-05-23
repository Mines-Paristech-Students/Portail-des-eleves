import React from "react";
import { FormCheck } from "react-bootstrap";

export const CheckboxField = ({ label, state, setState, id }) => (
    <label className="custom-control custom-checkbox">
        <FormCheck.Input
            className="custom-control-input"
            type="checkbox"
            checked={state[id]}
            onChange={() => {
                let newState = { ...state };
                newState[id] = !state[id];
                setState(newState);
            }}
        />
        <span className="custom-control-label">{label}</span>
    </label>
);
