import Form from "react-bootstrap/Form";
import React from "react";

export const InputField = ({
    label,
    placeholder,
    state,
    setState,
    ...props
}) => (
    <Form.Control
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder={placeholder}
        {...props}
    />
);
