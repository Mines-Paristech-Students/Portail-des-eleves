import React, { useContext, useEffect, useState } from "react";
import { api, useBetterQuery } from "../../../services/apiService";
import { Namespace, Tag } from "../../../models/tag";
import Spinner from "react-bootstrap/Spinner";
import { tablerColors } from "../../../utils/colors";
import { hashCode } from "../../../utils/hashcode";
import Autosuggest from "react-autosuggest";
import "./TagEdition.css";
import Fuse from "fuse.js";
import { ToastContext, ToastLevel } from "../Toast";

export const TagEdition = ({ model, id }) => {
    let [tags, setTags] = useState<Tag[]>([]);
    const newToast = useContext(ToastContext);

    let addTag = (newTag) => {
        api.tags
            .bind(model, id, newTag.id)
            .then((_) => {
                newToast({
                    message: "Tag ajouté.",
                    level: ToastLevel.Success,
                });
            })
            .catch(() => {
                newToast({
                    message: "Erreur lors de l'ajout du tag.",
                    level: ToastLevel.Error,
                });
            });
        setTags([...tags, newTag]);
    };

    let removeTag = (index) => {
        api.tags
            .unbind(model, id, tags[index].id)
            .then((_) => {
                newToast({
                    message: "Tag retiré.",
                    level: ToastLevel.Success,
                });
            })
            .catch(() => {
                newToast({
                    message: "Erreur lors du retrait du tag.",
                    level: ToastLevel.Error,
                });
            });
        setTags(tags.filter((tag, tagIndex) => index !== tagIndex));
    };

    let params = {};
    params[model] = id;
    useEffect(() => {
        api.tags.list(params).then((data) => {
            setTags(data.results);
        });
    }, [model, id]);

    return (
        <>
            <>
                {tags.map((tag, i) => (
                    <TagEditor
                        key={i}
                        tag={tag}
                        removeTag={() => removeTag(i)}
                    />
                ))}
            </>
            <AddTagInput model={model} id={id} addTag={addTag} />
        </>
    );
};

const AddTagInput = ({ model, id, addTag }) => {
    let [namespaces, setNamespaces] = useState<Namespace[]>([]); // All available namespaces
    let [selectedNamespace, setSelectedNamespace] = useState<Namespace | null>(
        null
    );
    let [fuseNamespace, setFuseNamespace] = useState<Fuse<
        Namespace,
        any
    > | null>(null); // Namespaces search object
    let [suggestionsNamespace, setSuggestionsNamespace] = useState<Namespace[]>(
        []
    ); // Currently displayed suggestions

    let [tags, setTags] = useState<Tag[]>([]); // All available tags
    let [fuseTag, setFuseTag] = useState<Fuse<Tag, any> | null>(null); // Tag search object
    let [suggestionsTag, setSuggestionsTag] = useState<Tag[]>([]); // Currently displayed suggestions

    let [value, setValue] = useState("Chargement en cours..."); // Text in the search input
    let [status, setStatus] = useState<"loading" | "error" | "OK">("loading"); // in {OK, loading, error}

    useEffect(() => {
        let params: any = {};
        params[model] = id;
        api.namespaces
            .list(params)
            .then((res) => {
                let namespaces = res.results;
                setNamespaces(namespaces);

                setFuseNamespace(
                    new Fuse(namespaces, {
                        keys: ["name"],
                    })
                );

                setSuggestionsNamespace(namespaces);
                setStatus("OK");
                setValue("");
            })
            .catch((error) => {
                setStatus("error");
                setValue(error.toString);
            });
    }, [model, id]);

    useEffect(() => {
        if (selectedNamespace != null) {
            api.tags.list({ namespace: selectedNamespace.id }).then((res) => {
                let tags = res.results;
                setTags(tags);
                setSuggestionsTag(tags);
                setFuseTag(
                    new Fuse(tags, {
                        keys: ["value"],
                    })
                );
            });
        } else {
            setTags([]);
            setFuseTag(null);
        }
    }, [selectedNamespace]);

    // Event handlers
    const onChange = (event, { newValue, method }) => {
        if (
            selectedNamespace !== null && // If there is a selected namespace
            (newValue.indexOf(":") === -1 || // but we removed the colon
                newValue.split(":")[0] != selectedNamespace.name) // Or tried to change the namespace name
        ) {
            setSelectedNamespace(null);
        }

        setValue(newValue);
    };

    const onKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    };

    const bindTag = (namespace, tag) => {};

    let onSuggestionsClearRequested = () => {};
    let onSuggestionSelected = (
        event,
        { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
    ) => {
        if (selectedNamespace === null) {
            setValue(`${suggestionValue}:`);
            setSelectedNamespace(suggestion);
        } else {
            addTag(suggestion);
            setSelectedNamespace(null);
            setValue("");
        }
    };
    let onSuggestionsFetchRequested = ({ value, reason }) => {
        if (selectedNamespace === null) {
            setSuggestionsNamespace(
                fuseNamespace!
                    .search(value, { limit: 10 })
                    .map((suggestion) => suggestion.item)
            );
        } else {
            setSuggestionsTag(
                fuseTag!
                    .search(value, { limit: 10 })
                    .map((suggestion) => suggestion.item)
            );
        }
    };

    // Rendering
    const theme = {
        container: "autosuggest",
        input: "form-control form-control-sm",
        suggestionsContainer: "dropdown suggestion-dropdown",
        suggestionsList: `dropdown-menu ${
            suggestionsNamespace.length ? "show" : ""
        }`,
        suggestion: "dropdown-item",
        suggestionFocused: "active",
    };

    const getSuggestionValue = (suggestion) =>
        (selectedNamespace !== null
            ? getSuggestionValueTag
            : getSuggestionValueNamespace)(suggestion);
    const getSuggestionValueNamespace = (suggestion) => suggestion.name;
    const getSuggestionValueTag = (suggestion) =>
        `${selectedNamespace?.name}: ${suggestion.value}`;
    const renderSuggestion = (suggestion, { query, isHighlighted }) => (
        <div className={isHighlighted ? "active" : ""}>
            {getSuggestionValue(suggestion)}
        </div>
    );

    let inputProps = {
        placeholder: "Ajouter un tag",
        value,
        onChange: onChange,
        onKeyDown: onKeyDown,
        disabled: status != "OK",
    };

    return (
        <Autosuggest
            suggestions={
                selectedNamespace !== null
                    ? suggestionsTag
                    : suggestionsNamespace
            }
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionSelected={onSuggestionSelected}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            theme={theme}
        />
    );
};

const TagEditor = ({ tag, removeTag }) => {
    let type =
        "tag-" +
        tablerColors[hashCode(tag.namespace.name) % tablerColors.length];
    return (
        <div className={`tag mb-2 mr-2 ${type}`}>
            {tag.namespace.name}
            <span className="tag-addon">{tag.value}</span>
            <span className="align-middle">
                <i className="fe fe-x ml-3" onClick={removeTag} />
            </span>
        </div>
    );
};
