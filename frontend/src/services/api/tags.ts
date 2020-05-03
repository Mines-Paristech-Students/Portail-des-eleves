import {
    apiService,
    PaginatedResponse,
    toUrlParams,
    unwrap,
} from "../apiService";
import { Tag } from "../../models/tag";

export const tags = {
    list: (params) => {
        console.log(params)
        params["page_size"] = 1000;
        return unwrap<PaginatedResponse<Tag[]>>(
            apiService.get("/tags/tags/" + toUrlParams(params))
        );
    },
};
