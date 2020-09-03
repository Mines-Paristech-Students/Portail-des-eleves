import { apiService, unwrap } from "../../apiService";
import { Library } from "../../../models/associations/library";

export const library = {
  update: ({ id, ...data }) =>
    unwrap<Library>(apiService.patch(`/associations/library/${id}/`, data)),
};
