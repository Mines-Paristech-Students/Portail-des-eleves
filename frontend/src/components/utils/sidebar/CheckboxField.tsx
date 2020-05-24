import React from "react";
import { FormCheck } from "react-bootstrap";

export const CheckboxField = ({ label, state, setState, id }) => (
    <label className="custom-control custom-checkbox">
        <FormCheck.Input
            className="custom-control-input"
            type="checkbox"
            checked={state[id]}
            onChange={() => {
                setState({
                    ...state,
                    [id]: !state[id],
                });
            }}
        />
        <span className="custom-control-label">{label}</span>
    </label>
);
