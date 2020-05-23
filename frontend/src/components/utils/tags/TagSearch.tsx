import React, { useEffect, useState } from "react";
import { api, useBetterPaginatedQuery } from "../../../services/apiService";
import { Tag } from "../../../models/tag";
import { Loading } from "../Loading";
import { ErrorMessage } from "../ErrorPage";
import { SidebarSection } from "../sidebar/SidebarSection";
import { CheckboxField } from "../sidebar/CheckboxField";
import { SidebarSeparator } from "../../Sidebar";

export const TagSearch = ({ tagsQueryParams, setTagParams }) => {
    const { resolvedData: tags, status, error } = useBetterPaginatedQuery<any>(
        ["tags.list", tagsQueryParams],
        api.tags.list
    );

    const [fieldsState, setFieldsState] = useState({});
    const [groups, setGroups] = useState({});

    const onStateChange = (state) => {
        setFieldsState(state);
        onSearchChange(state);
    };

    const onSearchChange = (params) => {
        // TODO: update with the new toUrlParams function
        const ids = Object.entries(params) // [ [namespace.tag_id, is_selected] ]
            .map(([key, value]) => value && key)
            .filter(Boolean)
            .join(",");

        setTagParams(ids.length > 0 ? { tags__are: ids } : {});
    };

    useEffect(() => {
        if (tags === undefined) {
            return;
        }

        let groups = {};
        let fieldsState = {};
        for (let tag of tags.results) {
            if (!groups.hasOwnProperty(tag.namespace.id)) {
                groups[tag.namespace.id] = [];
            }
            groups[tag.namespace.id].push(tag);
            fieldsState[tag.id] = false;
        }

        setGroups(groups);
        setFieldsState(fieldsState);
    }, [tags]);

    return status === "loading" ? (
        <Loading />
    ) : status === "error" ? (
        <ErrorMessage>Une erreur est survenue {error}</ErrorMessage>
    ) : tags ? (
        <>
            <SidebarSeparator />
            {Object.values(groups).map((group) => {
                let namespace = (group as Tag[])[0].namespace;
                return (
                    <SidebarSection
                        key={namespace.id}
                        retractable={true}
                        title={namespace.name}
                        retractedByDefault={false}
                    >
                        {(group as Tag[]).map((tag) => (
                            <CheckboxField
                                key={tag.id}
                                label={tag.value}
                                id={tag.id}
                                state={fieldsState}
                                setState={onStateChange}
                            />
                        ))}
                    </SidebarSection>
                );
            })}
        </>
    ) : null;
};
