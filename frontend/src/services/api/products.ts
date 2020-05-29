import {
    apiService,
    PaginatedResponse,
    toUrlParams,
    unwrap,
} from "../apiService";
import { Product } from "../../models/associations/marketplace";

export const products = {
    list: (associationId, params = {}, page = 1) => {
        params["marketplace"] = associationId;
        params["page"] = page;
        return unwrap<PaginatedResponse<Product[]>>(
            apiService.get(`/associations/products/${toUrlParams(params)}`)
        );
    },
    get: (productId) =>
        unwrap<Product>(
            apiService.get(`/associations/products/${productId}/`)
        ).then((product) => ({
            ...product,
            comment: product.comment || "",
            description: product.description || "",
        })),

    update: (product) =>
        unwrap<Product>(
            apiService.patch(`/associations/products/${product.id}/`, product)
        ),
};
