import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { Association } from "../../models/associations/association";
import { toUrlParams } from "../../utils/urlParam";

export type ListAssociationsParameters = {
  ordering?: "rank" | "-rank" | "name" | "-name";
};

export const associations = {
  list: (parameters: ListAssociationsParameters, page: number) =>
    unwrap<PaginatedResponse<Association[]>>(
      apiService.get(
        `/associations/associations/${toUrlParams({
          ...parameters,
          page: page,
        })}`
      )
    ),
  get: ({ associationId }: { associationId: string }) =>
    unwrap<Association>(
      apiService.get(`/associations/associations/${associationId}/`)
    ),
  create: (data: Pick<Association, "name" | "rank">) =>
    apiService.post("/associations/associations/", data),
  update: ({
    associationId,
    data,
  }: {
    associationId: string;
    data: Partial<Pick<Association, "name" | "rank">>;
  }) => apiService.patch(`/associations/associations/${associationId}/`, data),
  delete: ({ associationId }: { associationId: string }) =>
    apiService.delete(`/associations/associations/${associationId}/`),
  setLogo: (associationId, mediaId) =>
    unwrap<Association>(
      apiService.patch(`/associations/associations/${associationId}/`, {
        logo: mediaId,
      })
    ),
};
