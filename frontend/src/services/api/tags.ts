import {
    apiService,
    PaginatedResponse,
    toUrlParams,
    unwrap,
} from "../apiService";
import { Tag } from "../../models/tag";

export const tags = {
    list: (model, id, ...params) => {
        params["page_size"] = 1000;
        params[model] = id;
        return unwrap<PaginatedResponse<Tag[]>>(
            apiService.get("/tags/tags" + toUrlParams(params))
        );
    },
};
