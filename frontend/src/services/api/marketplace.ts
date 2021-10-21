import { Marketplace } from "../../models/associations/marketplace";
import { apiService, unwrap } from "../apiService";

export const marketplace = {
  get: (marketplaceId) =>
    unwrap<Marketplace>(
      apiService.get(`/associations/marketplace/${marketplaceId}`)
    ),
  update: ({ id, ...data }) =>
    unwrap<Marketplace>(
      apiService.patch(`/associations/marketplace/${id}/`, data)
    ),
  balance: {
    get: (marketplaceId, customerId) =>
      unwrap<{ balance: number }>(
        apiService.get(
          `/associations/marketplace/${marketplaceId}/balance/${customerId}/`
        )
      ),
  },
  subscription: {
    get: (marketplaceId, customerId) =>
      unwrap<{ subscriber: boolean }>(
        apiService.get(
          `/associations/marketplace/${marketplaceId}/subscription/${customerId}/`
        )
      ),
    update: ({marketplaceId, customerId, subscriber}) =>
      unwrap<{ subscriber: boolean }>(
        apiService.patch(
          `/associations/marketplace/${marketplaceId}/subscription/${customerId}/`
        )
      ),
  }
};
