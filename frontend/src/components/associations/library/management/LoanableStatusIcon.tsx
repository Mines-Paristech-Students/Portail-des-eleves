import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Loanable } from "../../../../models/associations/library";

const Base = ({
  tooltipText,
  icon,
  textVariant,
}: {
  tooltipText: string;
  icon: string;
  textVariant: string;
}) => (
  <OverlayTrigger
    placement="bottom"
    overlay={<Tooltip id="pending">{tooltipText}</Tooltip>}
  >
    <i className={`fe fe-${icon} text-${textVariant}`} />
  </OverlayTrigger>
);

export const LoanableStatusIcon = ({ status }: Pick<Loanable, "status">) =>
  status === "BORROWED" ? (
    <Base tooltipText="Emprunté" icon="x" textVariant="danger" />
  ) : status === "REQUESTED" ? (
    <Base tooltipText="Demandé" icon="eye" textVariant="warning" />
  ) : (
    <Base tooltipText="Disponible" icon="check" textVariant="success" />
  );
