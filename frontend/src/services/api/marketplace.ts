import { Marketplace } from "../../models/associations/marketplace";
import { apiService, unwrap } from "../apiService";

export const marketplace = {
  get: (marketplaceId) =>
    unwrap<Marketplace>(
      apiService.get(`/associations/marketplace/${marketplaceId}`)
    ),
  update: ({ id, ...data }) =>
    unwrap<Marketplace>(apiService.patch(`/associations/marketplace/${id}/`, data)),
  balance: {
    get: (marketplaceId, customerId) =>
      unwrap<{ balance: number }>(
        apiService.get(
          `/associations/marketplace/${marketplaceId}/balance/${customerId}/`
        )
      ),
  },
};
