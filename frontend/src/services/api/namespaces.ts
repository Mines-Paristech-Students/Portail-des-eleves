import { apiService, unwrap } from "../apiService";
import { Namespace } from "../../models/tag";

export const namespaces = {
    list: (model, id) => (
        unwrap<Namespace[]>(apiService.get(`/tags/namespaces/${model}/${id}/`))
    )
}
