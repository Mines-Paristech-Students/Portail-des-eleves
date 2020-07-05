import { Campaign } from "../../models/repartitions";
import { AxiosResponse } from "axios";
import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { toUrlParams } from "../../utils/urlParam";
import { User } from "../../models/user";

export type ListCampaignsApiParameters = {
  id?: number;
  status?: string;
};

export const campaigns = {
  list: (parameters: ListCampaignsApiParameters, page = 1) =>
    unwrap<PaginatedResponse<Campaign[]>>(
      apiService.get<PaginatedResponse<Campaign[]>>(
        `/repartitions/campaigns/${toUrlParams({ ...parameters, page: page })}`
      )
    ),
  get: (repartitionId) =>
    unwrap<Campaign>(
      apiService.get(`/repartitions/campaigns/${repartitionId}/`)
    ),
  create: ({
    data,
  }: {
    data: {
      id: number;
      name: string;
      status: string;
      groupsNumber: number;
      studentsNumber: number;
    }; //;students: User[]; propositions: { proposition: Proposition }[]
  }) => apiService.post("/repartitions/campaigns/", data),
};
