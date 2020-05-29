import {
    api,
    PaginatedResponse,
    useBetterQuery,
} from "../../../services/apiService";
import React from "react";
import { Tag as TagComponent } from "./Tag";
import { Tag } from "../../../models/tag";
import { Loading } from "../Loading";

export enum TaggableModel {
    Association = "association",
    Loanable = "loanable",
    Media = "media",
    Page = "page",
    Product = "product",
    Role = "role",
}

/**
 * @param model the `TaggableModel` value of the model we want the tag for.
 * @param id the id of the model
 * @param collapsed true if we want the tags to take less space
 * @constructor
 */
export const TagList = ({
    model,
    id,
    collapsed = false,
}: {
    model: TaggableModel;
    id: string;
    collapsed?: boolean;
}) => {
    const { data: tags, status, error } = useBetterQuery<
        PaginatedResponse<Tag[]>
    >(["tags.list", { [model]: id }], api.tags.list);

    return status === "loading" ? (
        <Loading />
    ) : status === "error" ? (
        <p className={"text-danger"}>
            Erreur lors du chargement des tags: {(error as any).toString()}
        </p>
    ) : tags ? (
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
    ) : null;
};
