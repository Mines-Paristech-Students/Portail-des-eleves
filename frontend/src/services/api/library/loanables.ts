import { apiService, PaginatedResponse, unwrap } from "../../apiService";
import { Loanable } from "../../../models/associations/library";
import { toUrlParams } from "../../../utils/urlParam";

export type LoanableListParameters = {
  library__id: string;
  ordering: "name" | "-name" | "comment" | "-comment" | "status" | "-status";
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
};
