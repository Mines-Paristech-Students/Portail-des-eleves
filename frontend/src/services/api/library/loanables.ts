import { apiService, PaginatedResponse, unwrap } from "../../apiService";
import { Loanable } from "../../../models/associations/library";
import { toUrlParams } from "../../../utils/urlParam";

export type LoanableListParameters = {
  library__id: string;
  ordering: "name" | "-name" | "comment" | "-comment" | "status" | "-status";
  search: string;
  page_size: number;
};

export const loanables = {
  list: (parameters: LoanableListParameters, page: number) =>
    unwrap<PaginatedResponse<Loanable>>(
      apiService.get(
        `/associations/loanables/${toUrlParams({
          ...parameters,
          page: page,
        })}`
      )
    ),
  get: ({ loanableId }: { loanableId: number | string }) =>
    unwrap<Loanable>(apiService.get(`/associations/loanables/${loanableId}/`)),
  create: ({
    data,
  }: {
    data: Pick<Loanable, "name" | "description" | "comment" | "library">;
  }) => apiService.post("/associations/loanables/", data),
  patch: ({
    id,
    data,
  }: {
    id: number | string;
    data: Partial<Pick<Loanable, "name" | "description" | "comment">>;
  }) => apiService.patch(`/associations/loanables/${id}/`, data),
  remove: ({ id }: { id: number | string }) =>
    apiService.delete(`/associations/loanables/${id}/`),
};
