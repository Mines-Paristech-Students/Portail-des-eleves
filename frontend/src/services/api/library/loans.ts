import { apiService, PaginatedResponse, unwrap } from "../../apiService";
import { Loan } from "../../../models/associations/library";
import { toUrlParams } from "../../../utils/urlParam";
import dayjs from "dayjs";

export type ListLoansApiParameters = {
  loanable?: { id: number | string; library: string };
  ordering?: "user__id" | "-user__id" | "request_date" | "-request_date";
  page_size?: number;
} & Partial<Pick<Loan, "user" | "status">>;

export const loans = {
  list: (parameters: ListLoansApiParameters, page: number) =>
    unwrap<PaginatedResponse<Loan[]>>(
      apiService.get(
        `/associations/loans/${toUrlParams({
          ...parameters,
          page: page,
        })}`
      )
    ).then((data) => {
      data.results.forEach((loan) => {
        loan.requestDate = dayjs(loan.requestDate).toDate();
        loan.expectedReturnDate = loan.expectedReturnDate
          ? dayjs(loan.expectedReturnDate).toDate()
          : null;
        loan.loanDate = loan.loanDate ? dayjs(loan.loanDate).toDate() : null;
        loan.realReturnDate = loan.realReturnDate
          ? dayjs(loan.realReturnDate).toDate()
          : null;
      });

      return data;
    }),
  patch: ({
    id,
    data,
  }: Pick<Loan, "id"> & {
    data: Partial<
      Pick<
        Loan,
        "status" | "expectedReturnDate" | "loanDate" | "realReturnDate"
      >
    >;
  }) => apiService.patch(`/associations/loans/${id}/`, data),
  create: ({ userId, loanableId }: { userId: string; loanableId: number }) =>
    apiService.post(`/associations/loans/`, {
      user: userId,
      loanable: loanableId,
    }),
  cancel: (loanId: number) =>
    apiService.patch(`associations/loans/${loanId}/`, { status: "CANCELLED" }),
};
