import Form from "react-bootstrap/Form";
import React from "react";

export const InputField = ({
    id,
    label,
    placeholder,
    state,
    setState,
    ...props
}) => (
    <>
        {label && <Form.Label>{label}</Form.Label>}
        <Form.Control
            value={state}
            placeholder={placeholder}
            checked={state[id]}
            onChange={(e) => setState({ ...state, id: e.target.value })}
            {...props}
        />
    </>
);
