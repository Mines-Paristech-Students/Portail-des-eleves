import React from "react";
import { Loan } from "../../../../../models/associations/library";
import { Tag } from "../../../../utils/tags/Tag";

/**
 * Display the provided loan status in a `Tag` element.
 *
 * @param status
 * @param priority if provided, if `status` is `PENDING`, then the `Tag` is
 * given a tooltip displaying the priority of the loan.
 * @constructor
 */
export const LoanStatusTag = ({
  status,
  priority,
}: Pick<Loan, "status"> & Partial<Pick<Loan, "priority">>) => {
  switch (status) {
    case "ACCEPTED":
      return <Tag color="primary" tag="Accepté" />;
    case "BORROWED":
      return <Tag color="info" tag="Emprunté" />;
    case "CANCELLED":
      return <Tag color="secondary" tag="Annulé" />;
    case "PENDING":
      return (
        <Tag
          color="warning"
          tag="En attente"
          tooltip={priority ? `Priorité : ${priority}` : ""}
        />
      );
    case "REJECTED":
      return <Tag color="danger" tag="Refusé" />;
    case "RETURNED":
      return <Tag color="success" tag="Retourné" />;
  }
};
