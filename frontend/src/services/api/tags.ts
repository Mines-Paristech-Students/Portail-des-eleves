import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { Tag } from "../../models/tag";
import { toUrlParams } from "../../utils/urlParam";

export const tags = {
  list: (params, axiosConfig = {}) => {
    params["page_size"] = 1000;
    return unwrap<PaginatedResponse<Tag[]>>(
      apiService.get("/tags/tags/" + toUrlParams(params), axiosConfig)
    );
  },

  bind: (model, instanceId, tagId) =>
    unwrap(apiService.post(`/tags/link/${model}/${instanceId}/tag/${tagId}/`)),

  unbind: (model, instanceId, tagId) =>
    unwrap(
      apiService.delete(`/tags/link/${model}/${instanceId}/tag/${tagId}/`)
    ),

  create: (value, namespace) =>
    unwrap<Tag>(
      apiService.post(`/tags/tags/`, {
        value: value,
        namespace: namespace.id,
      })
    ),
};
