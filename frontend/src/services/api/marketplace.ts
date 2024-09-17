import { Marketplace } from "../../models/associations/marketplace";
import { apiService, unwrap } from "../apiService";

export const marketplace = {
  get: (marketplaceId) =>
    unwrap<Marketplace>(
      apiService.get(`/associations/marketplace/${marketplaceId}`)
    ),
  createOrUpdate: (data) =>
    unwrap<Marketplace>(
      apiService.patch(`/associations/marketplace/create_or_update/`, data)
    ),
  balance: {
    get: (marketplaceId, customerId) =>
      unwrap<{ balance: number }>(
        apiService.get(
          `/associations/marketplace/${marketplaceId}/balance/${customerId}/`
        )
      ),
  },
};
