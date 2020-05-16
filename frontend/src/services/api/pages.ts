import { Page } from "../../models/associations/page";
import { apiService, PaginatedResponse, unwrap } from "../apiService";

export const pages = {
    list: (associationId) =>
        unwrap<PaginatedResponse<Page[]>>(
            apiService.get(
                `/associations/pages/?association=${associationId}&page_type=STATIC`
            )
        ),
    get: (pageId) =>
        unwrap<Page>(apiService.get(`/associations/pages/${pageId}`)),
    save: (page) => {
        if (!page.id) {
            return unwrap<Page>(apiService.post(`/associations/pages/`, page));
        }

        return unwrap<Page>(
            apiService.patch(`/associations/pages/${page.id}/`, page)
        );
    },
    delete: (page) => {
        return unwrap<Page>(
            apiService.delete(`/associations/pages/${page.id}/`)
        );
    },
};
