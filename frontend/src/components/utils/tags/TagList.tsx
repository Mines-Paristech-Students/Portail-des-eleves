import { api, useBetterPaginatedQuery } from "../../../services/apiService";
import React from "react";
import { Tag } from "./Tag";

export enum Models {
    Association = "association",
    Loanable = "loanable",
    Media = "media",
    Page = "page",
    Product = "product",
    Role = "role",
}

/**
 * @param model a `Models` value
 * @param id the id of the model
 * @param collapsed true if we want the tags to take less space
 * @constructor
 */
export const TagList = ({ model, id, collapsed = false }) => {
    const {
        resolvedData: tags,
        status,
        error,
    } = useBetterPaginatedQuery(`tags.${model}.${id}`, api.tags.list, [
        model,
        id,
    ]);

    if (status === "loading")
        return <p className={"text-center"}>Chargement en cours...</p>;
    else if (status === "error") {
        return (
            <p className={"text-danger"}>
                Erreur lors du chargement des tags: {error}
            </p>
        );
    }

    return tags.results.map((tag) => (
        <Tag
            tag={tag.namespace.name}
            addon={tag.value}
            key={tag.id}
            collapsed={collapsed}
        />
    ));
};
