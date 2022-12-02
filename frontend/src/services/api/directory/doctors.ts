import { Doctor } from "../../../models/directory/doctor";
import { toUrlParams } from "../../../utils/urlParam";
import { apiService, PaginatedResponse, unwrap } from "../../apiService";

export type ListDoctorsParameters = {
  ordering?: "rank" | "-rank" | "name" | "-name";
};

export const doctors = {
  list: (parameters: ListDoctorsParameters, page: number) =>
    unwrap<PaginatedResponse<Doctor[]>>(
      apiService.get(
        `/directory/doctors/${toUrlParams({
          ...parameters,
          page: page,
        })}`
      )
    ),
};
