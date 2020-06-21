import { apiService, PaginatedResponse, unwrap } from "../../apiService";
import { Loan } from "../../../models/associations/library";
import { toUrlParams } from "../../../utils/urlParam";

export type ListLoansApiParameters = {
  loanable?: { id: number | string; library: string };
  ordering?:
    | "user__id"
    | "-user__id"
    | "request_date"
    | "-request_date";
  page_size?: number;
} & Partial<Pick<Loan, "user" | "status">>;

export const loans = {
  list: (parameters: ListLoansApiParameters, page: number) =>
    unwrap<PaginatedResponse<Loan>>(
      apiService.get(
        `/associations/loans/${toUrlParams({
          ...parameters,
          page: page,
        })}`
      )
    ),
  post: ({ userId, loanableId }: { userId: string; loanableId: number }) =>
    apiService.post(`/associations/loans/`, {
      user: userId,
      loanable: loanableId,
    }),
  cancel: (loanId: number) =>
    apiService.patch(`associations/loans/${loanId}/`, { status: "CANCELLED" }),
};
