import React, { useEffect, useState } from "react";
import { api, useBetterPaginatedQuery } from "../../../services/apiService";
import { Tag } from "../../../models/tag";
import { Loading } from "../Loading";
import { ErrorMessage } from "../ErrorPage";
import { SidebarSection } from "../sidebar/SidebarSection";
import { CheckboxField } from "../sidebar/CheckboxField";
import Fuse from "fuse.js";
import { Form } from "react-bootstrap";
import { useURLState } from "../../../utils/useURLState";

export const TagSearch = ({ tagsQueryParams, setTagParams: setParams }) => {
    const { resolvedData: tags, status, error } = useBetterPaginatedQuery<any>(
        ["tags.list", tagsQueryParams],
        api.tags.list
    );

    /* fieldsState is a key value dict, with tags id as key, and a boolean to
     * tell whether or not they're selected as a value.
     */
    const [fieldsState, setFieldsState] = useState({});
    // key: namespace id, value: array of tags belonging to the namespace
    const [groups, setGroups] = useState<{ [key: string]: Tag[] }>({});

    /* Fuse search object, updated whe the tags are  updated. Tag filtering is
     * based on the `searchValue`, updated in a plain input.
     * `showingTags` is a 2-level tree, with namespace id in first level and
     * tag id in second level which has a boolean leaf to tell whether the
     * tag should be displayed or not.
     */
    const [fuseSearch, setFuseSearch] = useState(new Fuse([]));
    const [searchValue, setSearchValue] = useState("");
    const [showingTags, setShowingTags] = useState({});

    // Stores the selected tags into a string to be exploitable by
    // useURLState and to ensure a nice URL
    const [checkedTags, setCheckedTags] = useURLState(
        "tags",
        [] as string[],
        (data) => data.join("-"),
        (data) => data.split("-")
    );

    const onStateChange = (state) => {
        setFieldsState(state);
        onSearchChange(state);
    };

    const onSearchChange = (params) => {
        const ids = Object.entries(params) // [ [namespace.tag_id, is_selected] ]
            .map(([key, value]) => value && key)
            .filter(Boolean);
        setCheckedTags(ids);
    };

    useEffect(() => {
        if (tags === undefined) return;

        let groups = {};
        let fieldsState = {};
        let showingTags = {};

        // Initalize groups and checkbox states
        for (let tag of tags.results) {
            if (!groups.hasOwnProperty(tag.namespace.id)) {
                groups[tag.namespace.id] = [];
            }
            groups[tag.namespace.id].push(tag);
            fieldsState[tag.id] = checkedTags.includes(tag.id.toString());
        }

        setGroups(groups);
        setFieldsState(fieldsState);
        setShowingTags(showingTags);
        setParams(
            checkedTags.length > 0 ? { tags__are: checkedTags.join(",") } : {}
        );

        setFuseSearch(
            new Fuse(tags.results, {
                keys: ["value", "namespace.name"],
                limit: 10,
            })
        );
    }, [tags, checkedTags, setParams]);

    useEffect(() => {
        if (tags === undefined) return;

        setShowingTags((showingTags) => {
            let newShowingTags = { ...showingTags };

            // Mark all tags as not showing
            for (let tag of tags.results) {
                if (!newShowingTags.hasOwnProperty(tag.namespace.id)) {
                    newShowingTags[tag.namespace.id] = {};
                }

                delete newShowingTags[tag.namespace.id][tag.id];
            }

            // Mark showing tags as such
            fuseSearch
                .search(searchValue)
                .map((res) => res.item as Tag)
                .forEach((tag) => {
                    newShowingTags[tag.namespace.id][tag.id] = true;
                });

            return newShowingTags;
        });
    }, [searchValue, tags, fuseSearch]);

    return status === "loading" ? (
        <Loading />
    ) : status === "error" ? (
        <ErrorMessage>Une erreur est survenue {error}</ErrorMessage>
    ) : tags && tags.results.length > 0 ? (
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
