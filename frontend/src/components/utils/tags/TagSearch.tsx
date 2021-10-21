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

/**
 * Generic component to get filtering parameters related to model's tags.
 * Example :
 * const [tagsParams, setTagParams] = useState({});
 * <TagSearch
 *     setTagParams={setTagParams}
 *     tagsQueryParams={{
 *         page_size: 1000,
 *         namespace__scoped_to_model: "association",
 *         namespace__scoped_to_pk: associationId,
 *         related_to: "product",
 *     }}
 * />
 * <Pagination
 *   apiKey={[
 *     "medias.list",
 *     associationId,
 *     { ...tagParams },
 *   ]}
 *   apiMethod={api.medias.list}
 *   render={(medias, paginationControl) => (<YourList medias={medias}/>)}
 * />
 *
 * will display a tag search form for all products related to the association
 * with ID `associationId`. Note the page_size is fixed to 1000 because it
 * allows fluid UI but there will never be more than a thousand tags for an association.
 * This is also the upper limit for the backend, so don't forget to change
 * both the frontend and the backend if you want to increase it.
 *
 * @param tagsQueryParams a literal object of filtering parameters we want to use
 * to query the tags that will be proposed to the user. Useful to get only tags
 * related to a particular scope
 * @param setParams a `useState` variable setter in which the additional object
 * filtering parameters will be put. You'll simply have to unwrap them in
 * `getBetterPaginatedQuery` to use them
 */
export const TagSearch = ({ tagsQueryParams, setTagParams: setParams }) => {
  const {
    resolvedData: tags,
    status,
    error,
  } = useBetterPaginatedQuery<any>(
    ["tags.list", tagsQueryParams],
    api.tags.list
  );

  /* fieldsState is a key value dict, with tags id as key, and a boolean to
   * tell whether or not they're selected as a value. */
  const [fieldsState, setFieldsState] = useState({});
  // key: namespace id, value: array of tags belonging to the namespace
  const [groups, setGroups] = useState<{ [key: string]: Tag[] }>({});

  /* Fuse search object, updated whe the tags are  updated. Tag filtering is
   * based on the `searchValue`, updated in a plain input.
   * `showingTags` is a 2-level tree, with namespace id in first level and
   * tag id in second level which has a boolean leaf to tell whether the
   * tag should be displayed or not. */
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
    // Update checkboxes state
    setFieldsState(state);

    // update the checked tags model to save them in the URL
    const ids = Object.entries(state) // [ [namespace.tag_id, is_selected] ]
      .map(([key, value]) => value && key)
      .filter(Boolean);
    setCheckedTags(ids);
  };

  // Check the user checks/unchecks a tag, update the filtering parameter
  // in the parent
  useEffect(() => {
    setParams(
      checkedTags.length > 0 ? { tags__are: checkedTags.join(",") } : {}
    );
  }, [checkedTags, setParams]);

  // Once we get the tags, set up UI variables and Fuse search object
  useEffect(() => {
    if (tags === undefined) return; // The query isn't finished yet

    let groups = {};
    let fieldsState = {};
    let showingTags = {};

    // Initalize groups and checkbox states
    for (let tag of tags.results) {
      // Group all tags by namespace
      if (!groups.hasOwnProperty(tag.namespace.id)) {
        groups[tag.namespace.id] = [];
      }
      groups[tag.namespace.id].push(tag);

      // Update tags state depending on what we found in the URL
      fieldsState[tag.id] = checkedTags.includes(tag.id.toString());
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
    // Don't set the dependency to checkedTags as this effect should
    // only be  called when the component is mounted in order to initialize
    // the values
    // eslint-disable-next-line
  }, [tags, setParams]);

  // When the tag search input changes, update the visible tags to only
  // show the ones that match the query.
  useEffect(() => {
    if (tags === undefined) return; // If the tags aren't set yet, do nothing
    setShowingTags((showingTags) => {
      let newShowingTags = { ...showingTags };

      // Mark all tags as not showing
      for (let tag of tags.results) {
        if (!newShowingTags.hasOwnProperty(tag.namespace.id)) {
          newShowingTags[tag.namespace.id] = {};
        }
        delete newShowingTags[tag.namespace.id][tag.id];
      }

      // If the user isn't looking for anything, show everything
      if (searchValue === "") {
        tags.results.forEach(
          (tag) => (newShowingTags[tag.namespace.id][tag.id] = true)
        );
      } else {
        // Mark showing tags as such
        fuseSearch
          .search(searchValue)
          .map((res) => res.item as Tag)
          .forEach((tag) => {
            newShowingTags[tag.namespace.id][tag.id] = true;
          });
      }

      return newShowingTags;
    });
  }, [searchValue, tags, fuseSearch]);

  return status === "loading" ? (
    <Loading />
  ) : status === "error" ? (
    <ErrorMessage>Une erreur est survenue {error}</ErrorMessage>
  ) : tags && tags.results.length > 0 ? (
    <>
      {/* Tag search form */}
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
      {/* Display tags sections */}
      {Object.values(groups).map((group, index) => {
        // All tags of a group share the same namespace
        let namespace = (group as Tag[])[0].namespace;
        return (
          // Hide the section if we don't show any tag
          Object.keys(showingTags[namespace.id]).length > 0 && (
            <SidebarSection
              key={namespace.id}
              title={namespace.name}
              retractable={true}
              retractedByDefault={index >= 2 && searchValue === ""}
            >
              {(group as Tag[]).map(
                (tag) =>
                  // Show a tag iff it matches the query
                  showingTags[namespace.id][tag.id] && (
                    <CheckboxField
                      label={tag.value}
                      key={tag.id}
                      state={fieldsState[tag.id]}
                      onChange={(state) =>
                        onStateChange({
                          ...fieldsState,
                          [tag.id]: state,
                        })
                      }
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
