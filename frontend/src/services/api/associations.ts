import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { Association } from "../../models/associations/association";

export const associations = {
  list: () =>
    unwrap<PaginatedResponse<Association[]>>(
      apiService.get(`/associations/associations/`)
    ),
  get: (associationId) =>
    unwrap<Association>(
      apiService.get(`/associations/associations/${associationId}/`)
    ),
};
