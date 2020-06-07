import { Page } from "../../models/associations/page";
import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { toUrlParams } from "../../utils/urlParam";

export const pages = {
    list: (associationId, params = {}, page = 1) =>
        unwrap<PaginatedResponse<Page[]>>(
            apiService.get(
                `/associations/pages/${toUrlParams({
                    association_id: associationId,
                    page_type: "STATIC",
                    ...params,
                })}`
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
