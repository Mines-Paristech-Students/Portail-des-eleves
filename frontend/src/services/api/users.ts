import {
    apiService,
    PaginatedResponse,
    toUrlParams,
    unwrap,
} from "../apiService";
import { User } from "../../models/user";

export const users = {
    list: (params = {}, page = 1) => {
        params["page"] = page;
        return unwrap<PaginatedResponse<User>>(
            apiService.get(`/users/users/${toUrlParams(params)}`)
        );
    },
};
