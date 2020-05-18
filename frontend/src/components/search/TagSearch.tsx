import { api, useBetterQuery } from "../../services/apiService";
import { Association } from "../../models/associations/association";

export const TagSearch = ({ model, parentModel, parentModelId, params }) => {
    params["namespace__scope_to_model"] = parentModel;
    params["namespace__scope_to_pk"] = parentModelId;

    const { data: association, error, status } = useBetterQuery<Association>(
        ["tags.search.list", { params }],
        api.tags.list
    );
};
