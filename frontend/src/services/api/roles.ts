import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { Role } from "../../models/associations/role";

export const parseRoleDates = (role: Role) => {
    role.startDate = new Date(role.startDate);
    role.endDate = role.endDate ? new Date(role.endDate) : role.endDate;
};

export const roles = {
    list: () =>
        unwrap<PaginatedResponse<Role[]>>(
            apiService.get(`/associations/roles/`)
        ).then((data) => {
            data.results.forEach((role) => parseRoleDates(role));

            return data;
        }),
    get: (roleId) =>
        unwrap<Role>(apiService.get(`/associations/roles/${roleId}`)).then(
            (role) => {
                parseRoleDates(role);
                return role;
            }
        ),
};
