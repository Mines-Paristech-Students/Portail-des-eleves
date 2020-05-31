import React, { useEffect, useState } from "react";
import { api, useBetterPaginatedQuery } from "../../../services/apiService";
import { Tag } from "../../../models/tag";
import { Loading } from "../Loading";
import { ErrorMessage } from "../ErrorPage";
import { SidebarSection } from "../sidebar/SidebarSection";
import { CheckboxField } from "../sidebar/CheckboxField";
import Fuse from "fuse.js";
import { Form } from "react-bootstrap";

export const TagSearch = ({ tagsQueryParams, setTagParams: setParams }) => {
    const { resolvedData: tags, status, error } = useBetterPaginatedQuery<any>(
        ["tags.list", tagsQueryParams],
        api.tags.list
    );

    const [fieldsState, setFieldsState] = useState({});
    const [groups, setGroups] = useState({});
    const [fuseSearch, setFuseSearch] = useState(new Fuse([]));
    const [searchValue, setSearchValue] = useState("");
    const [showingTags, setShowingTags] = useState({});

    const onStateChange = (state) => {
        setFieldsState(state);
        onSearchChange(state);
    };

    const onSearchChange = (params) => {
        const ids = Object.entries(params) // [ [namespace.tag_id, is_selected] ]
            .map(([key, value]) => value && key)
            .filter(Boolean)
            .join(",");

        setParams(ids.length > 0 ? { tags__are: ids } : {});
    };

    useEffect(() => {
        if (tags === undefined) return;

        let groups = {};
        let fieldsState = {};
        let showingTags = {};
        for (let tag of tags.results) {
            if (!groups.hasOwnProperty(tag.namespace.id)) {
                groups[tag.namespace.id] = [];
            }
            groups[tag.namespace.id].push(tag);

            fieldsState[tag.id] = false;
        }

        setGroups(groups);
        setFieldsState(fieldsState);
        setShowingTags(showingTags);

        setFuseSearch(
            new Fuse(tags.results, {
                keys: ["value", "namespace.name"],
                limit: 10,
            })
        );
    }, [tags]);

    useEffect(() => {
        if (tags === undefined) return;

        let newShowingTags = { ...showingTags };

        for (let tag of tags.results) {
            if (!newShowingTags.hasOwnProperty(tag.namespace.id)) {
                newShowingTags[tag.namespace.id] = {};
            }

            delete newShowingTags[tag.namespace.id][tag.id];
        }

        fuseSearch
            .search(searchValue)
            .map((res) => res.item as Tag)
            .forEach((tag) => {
                newShowingTags[tag.namespace.id][tag.id] = true;
            });
        setShowingTags(newShowingTags);

        // avoid infinite looping because showingTags triggers the effect,
        // which changes showingTags, which triggers the effect and so on
        // eslint-disable-next-line
    }, [searchValue, tags]);

    return status === "loading" ? (
        <Loading />
    ) : status === "error" ? (
        <ErrorMessage>Une erreur est survenue {error}</ErrorMessage>
    ) : tags ? (
        <>
            <div className="input-icon mb-3">
                <Form.Control
                    placeholder="Rechercher un tag"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    size={"sm"}
                />
                <span className="input-icon-addon">
                    <i className="fe fe-search" />
                </span>
            </div>
            {Object.values(groups).map((group, index) => {
                let namespace = (group as Tag[])[0].namespace;
                return (
                    (searchValue === "" ||
                        Object.keys(showingTags[namespace.id]).length > 0) && (
                        <SidebarSection
                            key={namespace.id}
                            retractable={true}
                            title={namespace.name}
                            retractedByDefault={
                                index >= 2 && searchValue === ""
                            }
                        >
                            {(group as Tag[]).map(
                                (tag) =>
                                    (searchValue === "" ||
                                        showingTags[namespace.id][tag.id]) && (
                                        <CheckboxField
                                            key={tag.id}
                                            label={tag.value}
                                            id={tag.id}
                                            state={fieldsState}
                                            setState={onStateChange}
                                        />
                                    )
                            )}
                        </SidebarSection>
                    )
                );
            })}
        </>
    ) : null;
};
