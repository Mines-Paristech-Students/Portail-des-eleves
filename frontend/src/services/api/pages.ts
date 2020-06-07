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
                })}/`
            )
        ),
    get: (pageId) =>
        unwrap<Page>(apiService.get(`/associations/pages/${pageId}/`)),
    create: (page: Pick<Page, "title" | "text"> & { association: string }) =>
        apiService.post(`/associations/pages/`, page),
    edit: (page: Pick<Page, "id" | "title" | "text">) =>
        apiService.patch(`/associations/pages/${page.id}/`, page),
    delete: (pageId: string) => {
        return unwrap<Page>(
            apiService.delete(`/associations/pages/${pageId}/`)
        );
    },
};
