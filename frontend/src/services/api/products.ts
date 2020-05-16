import { Page } from "../../models/associations/page";
import {
    apiService,
    PaginatedResponse,
    toUrlParams,
    unwrap,
} from "../apiService";

export const products = {
    list: (associationId, params = {}, page = 1) => {
        params["association"] = associationId;
        params["page"] = page;
        return unwrap<PaginatedResponse<Page[]>>(
            apiService.get(`/associations/products/${toUrlParams(params)}`)
        );
    },
};
