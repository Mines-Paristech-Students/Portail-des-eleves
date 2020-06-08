import React, { useState } from "react";
import { Tag } from "../../../models/tag";
import { TagSelector } from "./TagSelector";

/**
 * Generic component to manage the tags of one object
 * @param model the model of the object ("association", "product", ...)
 * @param parentId the id of the object ("bde", 1, 2...)
 * @param onChange a callback function that must take the list of all the tags
 * as a parameter
 */
export const TagAdder = ({
    parent,
    parentId,
    onChange,
    placeholder = "Ajouter des tags",
}) => {
    const [tags, setTags] = useState<Tag[]>([]);

    const addTag = (tag) => {
        const newTags = [...tags, tag];
        setTags(newTags);
        onChange(newTags);
    };

    const removeTag = ({ id }) => {
        const newTags = tags.filter((tag) => tag.id !== id);
        setTags(newTags);
        onChange(newTags);
    };

    return (
        <TagSelector
            model={parent}
            id={parentId}
            onBind={addTag}
            onUnbind={removeTag}
            placeholder={placeholder}
        />
    );
};
