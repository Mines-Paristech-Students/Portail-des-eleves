import {
    Transaction,
    TransactionStatus,
} from "../../models/associations/marketplace";
import { apiService, unwrap } from "../apiService";
import { toUrlParams } from "../urlParam";

export const transactions = {
    create: (product, quantity, buyer, status = TransactionStatus.Ordered) =>
        apiService.post("/associations/transactions/", {
            product: product.id,
            quantity: quantity,
            buyer: buyer.id,
            status: status,
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
