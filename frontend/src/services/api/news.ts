import { Page } from "../../models/associations/page";
import { apiService, PaginatedResponse, unwrap } from "../apiService";

export const news = {
    list: (associationId) =>
        unwrap<PaginatedResponse<Page[]>>(
            apiService.get(
                `/associations/pages/?association=${associationId}&page_type=NEWS`
            )
        ),
    get: (newsId) =>
        unwrap<Page>(apiService.get(`/associations/pages/${newsId}`)),
};
