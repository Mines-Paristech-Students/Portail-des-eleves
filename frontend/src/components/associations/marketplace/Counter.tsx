import React, { useState } from "react";
import { User } from "../../../models/user";
import { UserSelector } from "../../utils/UserSelector";
import { CounterOrderMaker } from "./counter/CounterOrderMaker";

/**
 * Counter is the component used by people in marketplace's counter to sell
 * products. It allows quick user choice, making a basket and validating all
 * transactions at once.
 */
export const AssociationMarketplaceCounter = ({ association }) => {
    const [customer, setCustomer] = useState<User | null>(null);
    return (
        <>
            <p className={"display-4 m-0 float-left"}>
                {customer !== null ? (
                    <span
                        className="fe fe-arrow-left text-primary"
                        onClick={() => setCustomer(null)}
                    />
                ) : null}
            </p>
            {customer === null ? (
                <UserSelector setUser={setCustomer} />
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
