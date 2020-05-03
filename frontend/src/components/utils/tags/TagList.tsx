import { api, PaginatedResponse, useBetterPaginatedQuery, useBetterQuery } from "../../../services/apiService";
import React from "react";
import { Tag as TagComponent } from "./Tag";
import { Tag } from "../../../models/tag";

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
    let params: any = {};
    params[model] = id;
    const { data: tags, status, error } = useBetterQuery<PaginatedResponse<Tag[]>>(
        "tags.list",
        api.tags.list,
        params
    );

    if (status === "loading")
        return <p className={"text-center"}>Chargement des tags...</p>;
    else if (status === "error") {
        return (
            <p className={"text-danger"}>
                Erreur lors du chargement des tags: {(error as any).toString()}
            </p>
        );
    } else if (tags) {
        return (
            <>
                {tags.results.map((tag) => (
                    <TagComponent
                        tag={tag.namespace.name}
                        addon={tag.value}
                        key={tag.id}
                        collapsed={collapsed}
                    />
                ))}
            </>
        );
    }

    return null;
};
