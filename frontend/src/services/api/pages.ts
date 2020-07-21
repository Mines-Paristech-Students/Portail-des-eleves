import { Page } from "../../models/associations/page";
import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { toUrlParams } from "../../utils/urlParam";

export type PageListParameters = {
  association_id?: string;
  title?: string;
  page_type?: "NEWS" | "STATIC";
  ordering?:
    | "creation_date"
    | "-creation_date"
    | "last_update_date"
    | "-last_update_date";
  search?: string;
  page_size?: number;
};

export const pages = {
  list: (params: PageListParameters, page = 1) =>
    unwrap<PaginatedResponse<Page[]>>(
      apiService.get(
        `/associations/pages/${toUrlParams({
          ...params,
          page: page,
        })}`
      )
    ),
  get: (pageId) =>
    unwrap<Page>(apiService.get(`/associations/pages/${pageId}/`)),
  create: (
    page: Pick<Page, "title" | "text" | "pageType"> & { association: string }
  ) => apiService.post(`/associations/pages/`, page),
  edit: (page: Pick<Page, "id" | "title" | "text" | "pageType">) =>
    apiService.patch(`/associations/pages/${page.id}/`, page),
  delete: (pageId: string) => {
    return unwrap<Page>(apiService.delete(`/associations/pages/${pageId}/`));
  },
};
