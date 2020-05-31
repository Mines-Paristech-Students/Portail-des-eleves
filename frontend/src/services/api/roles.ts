import {
    apiService,
    PaginatedResponse,
    toUrlParams,
    unwrap,
} from "../apiService";
import { Role } from "../../models/associations/role";

export const parseRoleDates = (role: Role) => {
    role.startDate = new Date(role.startDate);
    role.endDate = role.endDate ? new Date(role.endDate) : role.endDate;
    return role;
};

export type RolesListApiParameters = {
    association: string;
    user?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
};

export const roles = {
    list: (parameters: RolesListApiParameters, page: number) =>
        unwrap<PaginatedResponse<Role[]>>(
            apiService.get(
                `/associations/roles/${toUrlParams({
                    ...parameters,
                    page: page,
                })}`
            )
        ).then((data) => {
            data.results = data.results.map(parseRoleDates);
            return data;
        }),
    get: (roleId) =>
        unwrap<Role>(apiService.get(`/associations/roles/${roleId}/`)).then(
            parseRoleDates
        ),
    delete: (roleId) => apiService.delete(`/associations/roles/${roleId}/`),
};
