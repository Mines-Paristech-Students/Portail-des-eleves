import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../services/apiService";
import { Namespace, Tag } from "../../../models/tag";
import { tablerColors, tablerColorsHex } from "../../../utils/colors";
import { hashCode } from "../../../utils/hashcode";
import "./TagEdition.css";
import Fuse from "fuse.js";
import { ToastContext } from "../Toast";
import Select from "react-select";
import axios from "axios";

const CancelToken = axios.CancelToken;

/**
 * An intermediary component to manage tags for objects. Will be used to build
 * `TagEdition` to manage tags for already created objects, but also `TagAddition`
 * used to add tag to a model *after* it's created.
 * @param model the model for which we want to query the tags. Either the object
 * to change (if already created) of it's tag parent (generally an `association`).
 * @param id same with the ID
 * @param onBind callback called every time a tag is added
 * @param onUnbind callback called when a tag is removed
 * @param placeholder
 */
export const TagSelector = ({
  model,
  id,
  onBind,
  onUnbind,
  placeholder = "Sélectionner des tags",
}) => {
  const { sendErrorToast } = useContext(ToastContext);

  const bindTag = (newTag) => {
    onBind(newTag);
    setTags([...tags, newTag]);
  };

  const removeTag = (tag) => {
    onUnbind(tag);
    setTags(tags.filter((t) => t.id !== tag.id));
  };

  // State declaration
  const [selectedNamespace, setSelectedNamespace] = useState<Namespace | null>(
    null
  ); // The namespace in which we want to add a tag
  const [namespaces, setNamespaces] = useState<Namespace[]>([]); // All available tags
  const [fuseNamespace, setFuseNamespace] = useState<Fuse<
    Namespace,
    any
  > | null>(null); // Namespaces search object
  const [suggestionsNamespace, setSuggestionsNamespace] = useState<Namespace[]>(
    []
  ); // Currently displayed suggestions

  const [tags, setTags] = useState<Tag[]>([]); // Tags that are linked to the model
  const [fuseTag, setFuseTag] = useState<Fuse<Tag, any> | null>(null); // Tag search object
  const [suggestionsTag, setSuggestionsTag] = useState<Tag[]>([]); // Currently displayed suggestions

  const [inputValue, setInputValue] = useState(""); // The text contained in the input
  const [searchValue, setSearchValue] = useState(""); // The effective value. For "namespace: label", it would be  "label"

  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading"
  );
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  // Load namespaces and set them as suggestion
  useEffect(() => {
    // Prepare to cancel the request, in case the component is unmounted
    // before the request finishes
    const source = CancelToken.source();
    api.namespaces
      .list(
        {
          [model]: id,
        },
        1,
        { cancelToken: source.token }
      )
      .then((res) => {
        let namespaces = res.results;
        setFuseNamespace(
          new Fuse(namespaces, {
            keys: ["name"],
          })
        );

        setNamespaces(namespaces);
        setSuggestionsNamespace(namespaces);
        setStatus("success");
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          return;
        }

        setStatus("error");
        setInputValue(`Erreur durant le chargement : ${error.toString()}`);
      });

    // Cancel the request on unmount
    return () => source.cancel();

    // avoid infinite loop with tags :
    // namespaces changes -> useEffect changes namespaces -> tag changes ...
    // eslint-disable-next-line
  }, [model, id]);

  // Give the tags related to the namespace
  useEffect(() => {
    const source = CancelToken.source();

    if (selectedNamespace !== null) {
      api.tags
        .list(
          { namespace: selectedNamespace.id },
          { cancelToken: source.token }
        )
        .then((res) => {
          let tags = res.results;
          setSuggestionsTag(tags);
          setFuseTag(
            new Fuse(tags, {
              keys: ["value"],
            })
          );
        });
    } else {
      setFuseTag(null);
    }

    return () => source.cancel();

    // avoid infinite loop with tags :
    // tags changes -> useEffect changes tags -> tag changes ...
    // eslint-disable-next-line
  }, [selectedNamespace]);

  // Get all tags of the model
  useEffect(() => {
    const source = CancelToken.source();

    api.tags
      .list(
        {
          [model]: id,
        },
        { cancelToken: source.token }
      )
      .then((data) => {
        setTags(data.results);
      })
      .catch(() => {}); // "handle" the cancellation

    return () => source.cancel();

    // avoid infinite loop with tags :
    // tags changes -> useEffect changes tags -> tag changes ...
    // eslint-disable-next-line
  }, [model, id]);

  // Event handlers
  const handleChange = (selectedOption, action) => {
    if (action.action === "select-option") {
      let selectedNamespaces = selectedOption.filter(
        (option) => option.type === "namespace"
      );

      let newTag = selectedOption.filter(
        (option) => option.type === "new_value"
      );

      if (selectedNamespaces.length >= 1) {
        // If there is a namespace in the selected option, we want to display the tags
        let selectedNamespace = selectedNamespaces[0].namespace;
        setSelectedNamespace(selectedNamespace);
        setInputValue(`${selectedNamespace.name}: `);
        setMenuIsOpen(true);
      } else if (newTag.length >= 1) {
        // If there is a namespace in the selected option, we want to display the tags
        api.tags
          .create(newTag[0].value, selectedNamespace)
          .then((createdTag) => {
            bindTag(createdTag);
          })
          .catch(() => {
            sendErrorToast("Erreur lors de l'ajout du tag.");
          });

        setSelectedNamespace(null);
      } else {
        // all tags in the selection options, we bind the last option added
        bindTag(selectedOption[selectedOption.length - 1].tag);
        setSelectedNamespace(null);
      }
    } else if (action.action === "remove-value") {
      removeTag(action.removedValue.tag);
    }
  };

  const onInputChange = (value, action) => {
    setInputValue(value);

    // Check if we still have a namespace selected
    let searchValue = value;
    if (value.indexOf(":") === -1) {
      if (selectedNamespace !== null) {
        setSelectedNamespace(null);
      }
    } else {
      const namespaceValue = value.split(":")[0];
      const matchingNamespaces = namespaces.filter(
        (namespace) => namespace.name === namespaceValue
      );
      if (matchingNamespaces.length !== 0) {
        if (selectedNamespace === null) {
          setSelectedNamespace(matchingNamespaces[0]);
        }
        searchValue = value.split(":")[1];
      }
    }

    searchValue = searchValue.trim();
    setSearchValue(searchValue);

    // Refresh the different suggestions
    if (selectedNamespace === null) {
      searchValue.length === 0
        ? namespaces.slice(0, 10)
        : setSuggestionsNamespace(
            fuseNamespace!
              .search(searchValue, { limit: 10 })
              .map((suggestion) => suggestion.item)
          );
    } else {
      setSuggestionsTag(
        fuseTag!
          .search(searchValue, { limit: 10 })
          .map((suggestion) => suggestion.item)
      );
    }
  };

  const filterOption = (candidate, input) => {
    // Don't display the "add new suggestion" field if we didn't enter anything
    if (candidate.data.type === "new_value") {
      return searchValue.length > 0;
    }

    return true;
  };

  return (
    <Select
      inputValue={inputValue}
      value={tags.map((tag) => ({
        // The current selected tags
        value: tag.value,
        label: (
          <>
            {tag.namespace.name}
            <span className={"tag-editor-value"}>{tag.value}</span>
          </>
        ),
        tag: tag,
        type: "tag",
      }))}
      onChange={handleChange}
      menuIsOpen={menuIsOpen}
      onMenuOpen={() => setMenuIsOpen(true)}
      onMenuClose={() => setMenuIsOpen(false)}
      isMulti={true}
      onInputChange={onInputChange}
      filterOption={filterOption}
      styles={colourStyles}
      isDisabled={status === "error"}
      placeholder={placeholder}
      options={
        // All possible suggestions
        selectedNamespace === null
          ? (suggestionsNamespace.map((namespace) => ({
              value: namespace.name,
              label: namespace.name,
              namespace: namespace,
              type: "namespace",
            })) as any)
          : (suggestionsTag.map((tag) => ({
              value: tag.value,
              label: `${tag.namespace.name}: ${tag.value}`,
              tag: tag,
              type: "tag",
            })) as any[]).concat([
              {
                value: searchValue,
                label: (
                  <em className={"text-center d-block"}>
                    Ajouter un nouveau tag : {searchValue}
                  </em>
                ),
                type: "new_value",
              },
            ])
      }
    />
  );
};

// Styling
const color = (data) =>
  tablerColorsHex[
    tablerColors[hashCode(data.tag.namespace.name) % tablerColors.length]
  ];
const colourStyles = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  multiValue: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: color(data),
      color: "white",
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    backgroundColor: color(data),
    color: "white",
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    backgroundColor: color(data),
    color: "white",
    ":hover": {
      color: "red",
    },
  }),
};
