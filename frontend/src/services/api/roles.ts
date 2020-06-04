import {
    apiService,
    PaginatedResponse,
    toUrlParams,
    unwrap,
} from "../apiService";
import { Role } from "../../models/associations/role";
import dayjs from "dayjs";

type MutateRolePayload = Pick<
    Role,
    "role" | "rank" | "startDate" | "endDate" | "permissions"
> & {
    // Not taken from `Role` because we only need the ids, not a full object.
    association?: string;
    user?: string;
};

export const parseRoleDates = (role: Role) => {
    role.startDate = new Date(role.startDate);
    role.endDate = role.endDate ? new Date(role.endDate) : role.endDate;
    return role;
};

/**
 * Format the dates of a `Role` payload before sending it to the backend.
 */
const formatRoleDates = (role: Partial<MutateRolePayload>) =>
    // An `undefined` field will not be sent in the payload (it means “do
    // not update this field”). However, `endDate` may also be `null` (when
    // the role has no `endDate`. In both cases, `role.endDate` should not
    // be parsed.
    ({
        ...role,
        startDate: role.startDate
            ? dayjs(role.startDate).format("YYYY-MM-DD")
            : undefined,
        endDate:
            role.endDate === null || role.endDate === undefined
                ? role.endDate
                : dayjs(role.endDate).format("YYYY-MM-DD"),
    });

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
    create: ({ role }: { role: MutateRolePayload }) =>
        apiService.post(`/associations/roles/`, formatRoleDates(role)),
    update: ({
        roleId,
        role,
    }: {
        roleId: number;
        role: Partial<MutateRolePayload>;
    }) =>
        apiService.patch(
            `/associations/roles/${roleId}/`,
            formatRoleDates(role)
        ),
    delete: (roleId) => apiService.delete(`/associations/roles/${roleId}/`),
};
