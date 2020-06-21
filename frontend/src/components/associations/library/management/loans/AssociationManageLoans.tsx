import React from "react";
import { Association } from "../../../../../models/associations/association";
import { useParams } from "react-router";
import { PageTitle } from "../../../../utils/PageTitle";
import { LoansTable } from "./LoansTable";
import { api, useBetterQuery } from "../../../../../services/apiService";
import { Loanable } from "../../../../../models/associations/library";
import { Loading } from "../../../../utils/Loading";
import { Error } from "../../../../utils/Error";

export const AssociationManageLoans = ({
  association,
}: {
  association: Association;
}) => {
  const { loanableId } = useParams<{ loanableId: string }>();

  const { data: loanable, error, status } = useBetterQuery<Loanable>(
    ["loanables.get", { loanableId: loanableId }],
    api.loanables.get
  );

  return status === "loading" ? (
    <Loading />
  ) : status === "error" ? (
    <Error detail={error} />
  ) : status === "success" && loanable ? (
    <>
      <PageTitle>
        Gérer les demandes de{" "}
        <span className="font-italic">{loanable.name}</span>
      </PageTitle>

      <LoansTable loanableId={loanableId} />
    </>
  ) : null;
};
