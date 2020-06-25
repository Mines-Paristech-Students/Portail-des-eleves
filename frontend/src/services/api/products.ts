import { apiService, PaginatedResponse, unwrap } from "../apiService";
import { Product } from "../../models/associations/marketplace";
import { toUrlParams } from "../../utils/urlParam";

export const products = {
  list: (associationId, params = {}, page = 1) =>
    unwrap<PaginatedResponse<Product[]>>(
      apiService.get(
        `/associations/products/${toUrlParams({
          ...params,
          marketplace: associationId,
          page: page,
        })}`
      )
    ),

  get: (productId) =>
    unwrap<Product>(
      apiService.get(`/associations/products/${productId}/`)
    ).then((product) => ({
      ...product,
      comment: product.comment || "",
      description: product.description || "",
    })),

  create: (product) =>
    unwrap<Product>(apiService.post(`/associations/products/`, product)),

  update: (product) =>
    unwrap<Product>(
      apiService.patch(`/associations/products/${product.id}/`, product)
    ),
};
