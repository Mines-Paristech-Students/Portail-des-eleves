import { Transaction } from "../../models/associations/marketplace";
import { apiService, unwrap } from "../apiService";

export const transactions = {
        create: (product, quantity, buyer) =>
            apiService.post("/associations/transactions/", {
                product: product.id,
                quantity: quantity,
                buyer: buyer.id,
            }),

        list: (marketplaceId, user) =>
            unwrap<Transaction[]>(
                apiService.get(
                    `associations/transactions/?marketplace=${marketplaceId}&buyer=${user.id}`
                )
            ),
    }
