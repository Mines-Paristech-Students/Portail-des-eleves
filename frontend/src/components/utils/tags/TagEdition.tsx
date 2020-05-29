import { api } from "../../../services/apiService";
import { ToastContext, ToastLevel } from "../Toast";
import React, { useContext } from "react";
import { TagSelector } from "./TagSelector";

/**
 * Generic component to manage the tags of one object
 * @param model the model of the object ("association", "product", ...)
 * @param id the id of the object ("bde", 1, 2...)
 */
export const TagEdition = ({ model, id }) => {
    const newToast = useContext(ToastContext);

    // API Helpers to bind and remove tags
    const bindTag = (newTag) => {
        api.tags
            .bind(model, id, newTag.id)
            .then((res) => {
                if (res !== "Tag is already linked") {
                    newToast({
                        message: "Tag ajouté.",
                        level: ToastLevel.Success,
                    });
                }
            })
            .catch(() => {
                newToast({
                    message: "Erreur lors de l'ajout du tag.",
                    level: ToastLevel.Error,
                });
            });
    };

    const removeTag = (tag) => {
        api.tags
            .unbind(model, id, tag.id)
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
