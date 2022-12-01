import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { Namespace } from "../../models/tag";
import { toUrlParams } from "../../utils/urlParam";

export const namespaces = {
  list: (params, _, axiosConfig = {}) => {
    return unwrap<PaginatedResponse<Namespace[]>>(
      apiService.get(
        "/tags/namespaces/" +
          toUrlParams({
            ...params,
          }),
        axiosConfig
      )
    );
  },
  create: ({ name, scoped_to_model, scoped_to_pk }) =>
    unwrap<Namespace>(
      apiService.post("/tags/namespaces/", {
        name: name,
        scoped_to_model: scoped_to_model,
        scoped_to_pk: scoped_to_pk,
      })
    ),
  delete: (namespaceId) =>
    unwrap<Namespace>(apiService.delete(`/tags/namespaces/${namespaceId}/`)),

  save: (namespace) =>
    unwrap<Namespace>(
      apiService.patch(`/tags/namespaces/${namespace.id}/`, namespace)
    ),
};
