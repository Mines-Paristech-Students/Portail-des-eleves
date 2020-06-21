import { apiService, PaginatedResponse, unwrap } from "../../apiService";
import { Loanable } from "../../../models/associations/library";

export const loans = {
  post: ({ userId, loanableId }: { userId: string; loanableId: number }) =>
    unwrap<PaginatedResponse<Loanable>>(
      apiService.post(`/associations/loans/`, {
        user: userId,
        loanable: loanableId,
      })
    ),
  cancel: (loanId: number) =>
    apiService.patch(`associations/loans/${loanId}/`, { status: "CANCELLED" }),
};
