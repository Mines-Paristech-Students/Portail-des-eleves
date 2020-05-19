import { useContext, useEffect, useState } from "react";
import { api } from "../../../services/apiService";
import { Tag } from "../../../models/tag";
import { ToastContext, ToastLevel } from "../Toast";

export const useTagSearch = (tagsQueryParams, setSidebar) => {
    const newToast = useContext(ToastContext);

    const [additionalParams, setAdditionalParams] = useState({});

    let onSearchChange = (params) => {
        let ids = Object.entries(params) // [ [namespace.tag_id, is_selected] ]
            .map(([key, value]) => value && key.split(".")[1])
            .filter(Boolean)
            .join(",");

        setAdditionalParams(ids.length > 0 ? { tags__are: ids } : {});
    };

    useEffect(() => {
        api.tags
            .list(tagsQueryParams)
            .then((tags) => {
                let groups = {};

                for (let tag of tags.results) {
                    if (!groups.hasOwnProperty(tag.namespace.id)) {
                        groups[tag.namespace.id] = [];
                    }
                    groups[tag.namespace.id].push(tag);
                }

                let sections = Object.values(groups).map((group) => {
                    let namespace = (group as Tag[])[0].namespace;
                    return {
                        title: namespace.name,
                        id: namespace.id,
                        retractable: true,
                        fields: (group as Tag[]).map((tag) => ({
                            type: "checkbox",
                            id: tag.id,
                            label: tag.value,
                            defaultValue: false,
                        })),
                    };
                });

                setSidebar({
                    notifyChange: onSearchChange,
                    sections: sections,
                });
            })
            .catch((err) => {
                newToast({
                    message: `Erreur lors de la récupération des options: ${err}`,
                    level: ToastLevel.Error,
                });
            });
    }, []);
    useEffect(() => () => setSidebar(null), []); // Reset the sidebar when leaving the page

    return additionalParams;
};
