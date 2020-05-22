import {
    apiService,
    PaginatedResponse,
    toUrlParams,
    unwrap,
} from "../apiService";
import { Namespace } from "../../models/tag";

export const namespaces = {
    list: (params) => {
        params["page_size"] = 1000;
        return unwrap<PaginatedResponse<Namespace[]>>(
            apiService.get("/tags/namespaces/" + toUrlParams(params))
        );
    },
    create: ({name, scoped_to_model, scoped_to_pk}) =>
        unwrap<Namespace>(
            apiService.post("/tags/namespaces/", {
                name: name,
                scoped_to_model: scoped_to_model,
                scoped_to_pk: scoped_to_pk,
            })
        ),
    delete: (namespaceId) =>
        unwrap<Namespace>(
            apiService.delete(`/tags/namespaces/${namespaceId}/`)
        ),
};
