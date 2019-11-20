import React from 'react';
import {useField} from "formik";
import Form from "react-bootstrap/Form";

function SelectGroupPillsItem({value, render, ...props}: any) {
    const [field] = useField({...props, value: value, type: "radio"});

    return (
        <label className="selectgroup-item">
            <Form.Control className="selectgroup-input"
                          type="radio"
                          {...field}>
            </Form.Control>
            {render}
        </label>
    )
}

/**
 * This component encapsulates the Formik logic into a React Bootstrap + Tabler UI component for a “selectgroup-pills”.
 * `items` is a `Map` value => component, which maps the value of a “selectgroup-item” to its rendering.
 */
export function SelectGroupPills({label, items, ...props}: any) {
    let components: any[] = [];

    items.forEach(
        (render: any, value: string) => {
            components.push(
                <SelectGroupPillsItem key={"item-" + value}
                                      value={value}
                                      render={render}
                                      {...props}/>
            );
        }
    );

    return (
        <Form.Group>
            <Form.Label>{label}</Form.Label>

            <div className="selectgroup selectgroup-pills">
                {components}
            </div>
        </Form.Group>
    )
}
