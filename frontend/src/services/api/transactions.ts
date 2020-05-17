import { Transaction, TransactionStatus } from "../../models/associations/marketplace";
import { apiService, toUrlParams, unwrap } from "../apiService";

export const transactions = {
    create: (product, quantity, buyer, status=TransactionStatus.Ordered) =>
        apiService.post("/associations/transactions/", {
            product: product.id,
            quantity: quantity,
            buyer: buyer.id,
        }),
    list: (marketplaceId, params = {}, page = 1) => {
        params["marketplace"] = marketplaceId;
        params["page"] = page;

        return unwrap<Transaction[]>(
            apiService.get(`associations/transactions/${toUrlParams(params)}`)
        );
    },
    patch: (transaction) =>
        unwrap<Transaction>(
            apiService.patch(
                `/associations/transactions/${transaction.id}/`,
                transaction
            )
        ),
};
