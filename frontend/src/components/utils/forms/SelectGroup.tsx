import React from "react";
import { useField } from "formik";
import Form from "react-bootstrap/Form";

function SelectGroupItem({ value, render, ...props }: any) {
    const [field] = useField({ ...props, value: value, type: "radio" });

    return (
        <label className="selectgroup-item">
            <input className="selectgroup-input" type="radio" {...field} />
            {render}
        </label>
    );
}

interface Props {
    type: "inline" | "pills" | "vertical";
    label: string;
    items: Map<string, any>;
    [props: string]: any;
}

/**
 * This component encapsulates the Formik logic into a React Bootstrap + Tabler UI component for a “selectgroup-...”.
 *
 * Example:
 * ```
 * let items = new Map();
 *
 * items.set(
 *     "CHOICE_1",
 *     <span className="selectgroup-button selectgroup-button-icon">
 *         <i className="fe fe-check text-success" /> Choix 1
 *     </span>
 * );
 *
 * ...
 *
 * return (
 *     <SelectGroup type="pills" label="Statut" name="state" items={items} />
 * );
 * ```
 *
 * @param type Choose between "inline", "pills" and "vertical".
 * @param label the key of Formik's `values` which will give you access to the selected item (this value is the corresponding key of the `items` map).
 * @param items a `Map` value => component, which maps the value of a “selectgroup-item” to its rendering.
 * @param props passed to the `SelectGroupItem` component.
 */
export function SelectGroup({ type, label, items, ...props }: Props) {
    let components: any[] = [];

    items.forEach((render: any, value: string) => {
        components.push(
            <SelectGroupItem
                key={"item-" + value}
                value={value}
                render={render}
                {...props}
            />
        );
    });

    let className = "selectgroup ";

    switch (type) {
        case "pills":
            className += "selectgroup-pills";
            break;
        case "vertical":
            className += "selectgroup-vertical w-100";
            break;
        case "inline":
        default:
            break;
    }

    return (
        <Form.Group>
            <Form.Label>{label}</Form.Label>

            <div className={className}>{components}</div>
        </Form.Group>
    );
}
