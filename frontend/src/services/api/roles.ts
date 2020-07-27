import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { Role } from "../../models/associations/role";
import dayjs from "dayjs";
import { castDatesToUrlParam, toUrlParams } from "../../utils/urlParam";

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
  is_active?: boolean;
  start_date_before?: Date;
  start_date_after?: Date;
  end_date_before?: Date;
  end_date_after?: Date;
  permission?: (
    | "administration"
    | "election"
    | "event"
    | "media"
    | "library"
    | "marketplace"
    | "page"
  )[];
  ordering?: string;
  page_size?: number;
};

export const roles = {
  list: (parameters: RolesListApiParameters, page: number) =>
    unwrap<PaginatedResponse<Role[]>>(
      apiService.get(
        `/associations/roles/${toUrlParams({
          ...castDatesToUrlParam(
            {
              start_date_before: parameters.start_date_before,
              start_date_after: parameters.start_date_after,
              end_date_before: parameters.end_date_before,
              end_date_after: parameters.end_date_after,
            },
            "YYYY-MM-DD"
          ),
          association: parameters.association,
          user: parameters.user,
          is_active: parameters.is_active,
          permission: parameters.permission,
          ordering: parameters.ordering,
          page_size: parameters.page_size,
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
    apiService.patch(`/associations/roles/${roleId}/`, formatRoleDates(role)),
  delete: (roleId) => apiService.delete(`/associations/roles/${roleId}/`),
};
