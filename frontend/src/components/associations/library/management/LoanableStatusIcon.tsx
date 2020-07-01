import React from "react";
import { Loanable } from "../../../../models/associations/library";
import { Tag } from "../../../utils/tags/Tag";

export const LoanableStatusIcon = ({ status }: Pick<Loanable, "status">) =>
  status === "BORROWED" ? (
    <Tag tag="Prêté" color="info" />
  ) : status === "REQUESTED" ? (
    <Tag tag="Demandé" color="warning" />
  ) : (
    <Tag tag="Non demandé" color="secondary" />
  );
