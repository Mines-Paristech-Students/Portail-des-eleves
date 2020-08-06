import React, { useState } from "react";
import { User } from "../../../models/user";
import { CounterOrderMaker } from "./counter/CounterOrderMaker";
import { UserSelector } from "../../utils/UserSelector";

/**
 * Counter is the component used by people in marketplace's counter to sell
 * products. It allows quick user choice, making a basket and validating all
 * transactions at once.
 */
export const AssociationMarketplaceCounter = ({ association }) => {
  const [customer, setCustomer] = useState<User | null>(null);
  return (
    <>
      <p className={"h1 m-0 mt-2 float-left"}>
        {customer !== null ? (
          <span
            className="fe fe-arrow-left text-primary"
            onClick={() => setCustomer(null)}
          />
        ) : null}
      </p>
      {customer === null ? (
        <UserSelector
          setUser={setCustomer}
          title={"Comptoir"}
          helper={"Cliquez pour ouvrir un compte"}
        />
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
