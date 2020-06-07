import { apiService, unwrap } from "../apiService";
import { Funding, FundingStatus } from "../../models/associations/marketplace";
import { toUrlParams } from "../../utils/urlParam";

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
    list: (marketplaceId, params, page = 1) => {
        params["marketplace"] = marketplaceId;
        params["page"] = page;
        return unwrap<Funding[]>(
            apiService.get(`/associations/fundings/${toUrlParams(params)}`)
        );
    },
};
