import { Repartition } from "../../models/repartitions";
import { AxiosResponse } from "axios";
import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { toUrlParams } from "../../utils/urlParam";
import { User } from "../../models/user";

/**
 * Parse the `publicationDate` and `creationDateTime` JSON field.
 *
 * Should be called in a `then` after an `unwrap<PaginatedResponse<Poll[]>>`.
 */

export type ListRepartitionsApiParameters = {
  user?: string;
  status?: "OPEN" | "CLOSED" | "RESULTS"[];
  ordering?:
    | "user__pk"
    | "status"
    | "-user__pk"
    | "-status"
  is_active?: boolean;
};

export const repartitions = {
  list: (parameters: ListRepartitionsApiParameters, page = 1) =>
    unwrap<PaginatedResponse<Repartition[]>>(
      apiService
        .get<PaginatedResponse<Repartition[]>>(
          `/repartitions/${toUrlParams({ ...parameters, page: page })}`
        )
    ),
  get: (repartitionId) => unwrap<Repartition>(apiService.get(`/repartitions/${repartitionId}/`)),
  create: ({
    data,
  }: {
    data: { name: string; status: string, groupsNumber: number, studentsNumber: number }; //;students: User[]; propositions: { proposition: Proposition }[]
  }) => apiService.post("/repartitions/", data),
  update: ({
    repartitionId,
    data,
  }: {
    repartitionId;
    data: {
      status?: "OPEN" | "CLOSED" | "RESULTS";
    };
  }) => {

    return apiService.patch(`/repartitions/${repartitionId}/`, data);
  },
  remove: ({ repartitionId }) => apiService.delete(`/repartitions/${repartitionId}/`),
  vote: ({ user, repartitionId, choices }) =>
    apiService.post(`/repartitions/${repartitionId}/vote/`, {
      user: user.id,
      wish: choices,
    }),
};