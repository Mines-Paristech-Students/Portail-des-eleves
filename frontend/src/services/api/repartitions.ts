import { Repartition } from "../../models/repartitions";
import { AxiosResponse } from "axios";
import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { toUrlParams } from "../../utils/urlParam";
import { User } from "../../models/user";

export type ListRepartitionsApiParameters = {
  status?: string;
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