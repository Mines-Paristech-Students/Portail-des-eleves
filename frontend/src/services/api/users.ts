import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { User } from "../../models/user";

export const users = {
    list: (page) =>
        unwrap<PaginatedResponse<User[]>>(
            apiService.get(`/users/users/?page=${page}`)
        ),
};
