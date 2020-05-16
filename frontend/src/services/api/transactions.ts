import { Transaction } from "../../models/associations/marketplace";
import { apiService, unwrap } from "../apiService";
import { marketplace } from "./marketplace";

export const transactions = {
    create: (product, quantity, buyer) =>
        apiService.post("/associations/transactions/", {
            product: product.id,
            quantity: quantity,
            buyer: buyer.id,
        }),
    list: (marketplaceId, params) => {
        params["marketplace"] = marketplaceId;
        unwrap<Transaction[]>(
            apiService.get(
                `associations/transactions/${toUrlParams(params)}`
            )
        )
    }
};
