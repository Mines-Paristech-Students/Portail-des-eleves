import React, { useState } from "react";
import {
    api,
    useBetterPaginatedQuery,
    useBetterQuery,
} from "../../../services/apiService";
import { Namespace } from "../../../models/tag";
import Spinner from "react-bootstrap/Spinner";
import Select from "react-select";

const TagValueSelector = ({ namespace }) => {
    const { resolvedData: data, status, error } = useBetterPaginatedQuery(
        "tags.list",
        api.tags.list,
        [
            {
                namespace: namespace.id,
            },
        ]
    );

    if (status === "loading")
        return <Spinner animation="border" role="status" />;
    else if (status === "error")
        return <p>Error occurred : {(error as any).toString()}</p>;
    else if (data.results) {
        let options = data.results.map((tag) => ({
            value: tag,
            label: tag.name,
        }));

        return (
            <>
                <span>{namespace.name}</span>
                <Select options={options} />
            </>
        );
    }

    return null;
};

export const TagEdition = ({ model, id }) => {
    const { data, status, error } = useBetterQuery<{ namespaces: Namespace[] }>(
        "namespaces.list",
        api.namespaces.list,
        [model, id]
    );

    /*let colorStyle = {
        multiValue: (styles, { data }) => {
            const color =
                tablerColorsHex[
                    tablerColors[hashCode(data.label) % tablerColors.length]
                ];
            return {
                ...styles,
                backgroundColor: color,
            };
        },
        multiValueLabel: (styles, { data }) => ({
            ...styles,
            color: "white",
        }),
        multiValueRemove: (styles, { data }) => ({
            ...styles,
            color: "white",
        }),
    };*/

    let [tags, setTags] = useState<any[]>([]);

    let onSelectNamespace = (selected, event) => {
        if (event.action !== "select-option") {
            return;
        }

        setTags([
            ...tags,
            {
                namespace: selected.value,
            },
        ]);
    };

    if (status === "loading")
        return <Spinner animation="border" role="status" />;
    else if (status === "error")
        return <p>Error occurred : {(error as any).toString()}</p>;
    else if (data && data.namespaces) {
        let namespaces = data.namespaces;
        let options = namespaces.map((namespace) => ({
            value: namespace,
            label: namespace.name,
        }));

        return (
            <>
                <ul>
                    {tags.map((tag, i) => (
                        <li key={tag.namespace.id + "-" + i}>
                            <TagValueSelector namespace={tag.namespace} />
                        </li>
                    ))}
                </ul>

                <Select options={options} onChange={onSelectNamespace} />
            </>
        );
    }

    return null;
};
