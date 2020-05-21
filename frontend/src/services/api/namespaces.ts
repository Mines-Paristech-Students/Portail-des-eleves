import {
    apiService,
    PaginatedResponse,
    toUrlParams,
    unwrap,
} from "../apiService";
import { Namespace } from "../../models/tag";

export const namespaces = {
    list: (params) => {
        params["page_size"] = 1000;
        return unwrap<PaginatedResponse<Namespace[]>>(
            apiService.get("/tags/namespaces/" + toUrlParams(params))
        );
    },
};
