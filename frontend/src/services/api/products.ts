import { Page } from "../../models/associations/page";
import { apiService, PaginatedResponse, unwrap } from "../apiService";

export const products = {
    list: (associationId, page = 1) =>
        unwrap<PaginatedResponse<Page[]>>(
            apiService.get(
                `/associations/products/?association=${associationId}&page=${page}`
            )
        )
};
