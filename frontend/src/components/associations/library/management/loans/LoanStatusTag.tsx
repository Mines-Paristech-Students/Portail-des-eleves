import React from "react";
import { Loan } from "../../../../../models/associations/library";
import { Tag } from "../../../../utils/tags/Tag";

export const LoanStatusTag = ({ status }: Pick<Loan, "status">) => {
  switch (status) {
    case "ACCEPTED":
      return <Tag color="primary" tag="Accepté" />;
    case "BORROWED":
      return <Tag color="info" tag="Emprunté" />;
    case "CANCELLED":
      return <Tag color="secondary" tag="Annulé" />;
    case "PENDING":
      return <Tag color="warning" tag="En attente" />;
    case "REJECTED":
      return <Tag color="danger" tag="Refusé" />;
    case "RETURNED":
      return <Tag color="success" tag="Retourné" />;
  }
};
