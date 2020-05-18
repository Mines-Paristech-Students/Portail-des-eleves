import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { User } from "../../models/user";

export const users = {
    list: (
        {
            searchKey,
            promotions,
        }: {
            searchKey: string;
            promotions?: { value: string; label: string }[];
        },
        page
    ) =>
        unwrap<PaginatedResponse<User[]>>(
            apiService.get(
                `/users/users/?page=${page}${
                    searchKey ? `&search=${searchKey}` : ""
                }${
                    promotions
                        ? `&promotion=${promotions
                              .map((promotion) => promotion.value)
                              .join(",")}`
                        : ""
                }`
            )
        ),
    listPromotions: () =>
        unwrap<{ promotions: string[] }>(apiService.get("/users/promotions")),
};
