import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { User } from "../../models/user";
import { toUrlParams } from "../../utils/urlParam";

export const users = {
  list: (params, page = 1) =>
    unwrap<PaginatedResponse<User[]>>(
      apiService.get(`/users/users/${toUrlParams({ ...params, page: page })}`)
    ),
  listPromotions: () =>
    unwrap<{ promotions: string[] }>(apiService.get("/users/promotions")),
};
