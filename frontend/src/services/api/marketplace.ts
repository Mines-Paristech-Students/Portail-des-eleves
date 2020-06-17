import { Marketplace } from "../../models/associations/marketplace";
import { apiService, unwrap } from "../apiService";

export const marketplace = {
  get: (marketplaceId) =>
    unwrap<Marketplace>(
      apiService.get(`/associations/marketplace/${marketplaceId}`)
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
