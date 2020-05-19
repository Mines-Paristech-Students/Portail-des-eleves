import Form from "react-bootstrap/Form";
import React from "react";

export const InputField = (label, placeholder, state, setState) => (
    <label className="custom-control custom-checkbox">
        <Form.Control
            value={state}
            onChange={(e) => setState(e.target.value)}
        />
        <span className="custom-control-label">Accepté</span>
    </label>
);
