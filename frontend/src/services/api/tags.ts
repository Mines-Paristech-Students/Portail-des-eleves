import {
    apiService,
    PaginatedResponse,
    toUrlParams,
    unwrap,
} from "../apiService";
import { Tag } from "../../models/tag";

export const tags = {
    list: (params) => {
        params["page_size"] = 1000;
        return unwrap<PaginatedResponse<Tag[]>>(
            apiService.get("/tags/tags/" + toUrlParams(params))
        );
    },

    bind: (model, instanceId, tagId) => {
        return unwrap(
            apiService.post(`/tags/link/${model}/${instanceId}/tag/${tagId}/`)
        );
    },

    unbind: (model, instanceId, tagId) => {
        return unwrap(
            apiService.delete(`/tags/link/${model}/${instanceId}/tag/${tagId}/`)
        );
    },
};
