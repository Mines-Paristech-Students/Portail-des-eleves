import { api } from "../../../services/apiService";
import { ToastContext } from "../Toast";
import React, { useContext } from "react";
import { TagSelector } from "./TagSelector";
import "./TagEdition.css";

/**
 * Generic component to manage the tags of one object
 * @param model the model of the object ("association", "product", ...)
 * @param id the id of the object ("bde", 1, 2...)
 */
export const TagEdition = ({ model, id }) => {
    const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

    // API Helpers to bind and remove tags
    const bindTag = (newTag) => {
        api.tags
            .bind(model, id, newTag.id)
            .then((res) => {
                if (res !== "Tag is already linked") {
                    sendSuccessToast("Tag ajouté.");
                }
            })
            .catch(() => {
                sendErrorToast("Erreur lors de l'ajout du tag.");
            });
    };

    const removeTag = (tag) => {
        api.tags
            .unbind(model, id, tag.id)
            .then((_) => {
                sendSuccessToast("Tag retiré.");
            })
            .catch(() => {
                sendErrorToast("Erreur lors du retrait du tag.");
            });
    };

    return (
        <TagSelector
            model={model}
            id={id}
            onBind={bindTag}
            onUnbind={removeTag}
        />
    );
};
