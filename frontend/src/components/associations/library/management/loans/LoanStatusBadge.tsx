import React from "react";
import { Loan } from "../../../../../models/associations/library";
import Badge from "react-bootstrap/Badge";

export const LoanStatusBadge = ({ status }: Pick<Loan, "status">) => {
  switch (status) {
    case "ACCEPTED":
      return <Badge variant="primary">Accepté</Badge>;
    case "BORROWED":
      return <Badge variant="info">Emprunté</Badge>;
    case "CANCELLED":
      return <Badge variant="secondary">Annulé</Badge>;
    case "PENDING":
      return <Badge variant="warning">En attente</Badge>;
    case "REJECTED":
      return <Badge variant="danger">Refusé</Badge>;
    case "RETURNED":
      return <Badge variant="success">Retourné</Badge>;
  }
};
