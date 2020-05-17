import { apiService, toUrlParams, unwrap } from "../apiService";
import { Funding, FundingStatus } from "../../models/associations/marketplace";

export const fundings = {
    create: ({ marketplaceId, customerId, value }) =>
        unwrap<Funding>(
            apiService.post(`/associations/fundings/`, {
                user: customerId,
                marketplace: marketplaceId,
                value: value,
                status: FundingStatus.Funded,
            })
        ),
    list: (marketplaceId, params) => {
        params["marletplace"] = marketplaceId;
        return unwrap<Funding[]>(
            apiService.get(`/associations/fundings/${toUrlParams(params)}`)
        );
    },
};
