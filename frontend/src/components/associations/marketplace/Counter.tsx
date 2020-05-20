import React, { useState } from "react";
import { PageTitle } from "../../utils/PageTitle";
import { User } from "../../../models/user";
import { UserSelector } from "../../utils/UserSelector";
import { CounterOrderMaker } from "./counter/CounterOrderMaker";

/**
 * Counter is the component used by people in marketplace's counter to sell
 * products. It allows quick user choice, making a backet and validating all
 * transactions at once.
 */
export const AssociationMarketplaceCounter = ({ association }) => {
    const [customer, setCustomer] = useState<User | null>(null);

    return (
        <>
            <PageTitle>
                {customer !== null ? (
                    <span
                        className="fe fe-arrow-left text-primary"
                        onClick={() => setCustomer(null)}
                    />
                ) : null}
                Comptoir {customer ? ` - ${customer.id}` : null}
            </PageTitle>
            {customer === null ? (
                <UserSelector setCustomer={setCustomer} />
            ) : (
                <CounterOrderMaker
                    marketplaceId={association.id}
                    customer={customer}
                    resetCustomer={() => setCustomer(null)}
                />
            )}
        </>
    );
};
