import { formatPrice } from "../../../utils/format";
import React from "react";
import { api, useBetterQuery } from "../../../services/apiService";
import { Loading } from "../../utils/Loading";

export const Balance = ({ marketplaceId, user }) => {
  const { data: balance, status, error } = useBetterQuery(
    ["marketplace.balance", marketplaceId, user.id],
    api.marketplace.balance.get
  );

  return status === "loading" ? (
    <Loading />
  ) : status === "error" ? (
    <em>Erreur {error}</em>
  ) : (
    <span>{formatPrice((balance as { balance: number }).balance)}</span>
  );
};
