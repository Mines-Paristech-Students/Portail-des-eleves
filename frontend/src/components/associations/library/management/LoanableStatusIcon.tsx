import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export const LoanableStatusIcon = ({
  status,
}: {
  status: "AVAILABLE" | "BORROWED" | "REQUESTED";
}) => {
  switch (status) {
    case "AVAILABLE":
      return (
        <OverlayTrigger
          placement={"bottom"}
          overlay={<Tooltip id="accepted">Disponible</Tooltip>}
        >
          <i className="fe fe-check text-success" />
        </OverlayTrigger>
      );
    case "BORROWED":
      return (
        <OverlayTrigger
          placement={"bottom"}
          overlay={<Tooltip id="refused">Emprunté</Tooltip>}
        >
          <i className="fe fe-x text-danger" />
        </OverlayTrigger>
      );
    case "REQUESTED":
      return (
        <OverlayTrigger
          placement={"bottom"}
          overlay={<Tooltip id="pending">Demandé</Tooltip>}
        >
          <i className="fe fe-eye text-warning" />
        </OverlayTrigger>
      );
  }
};
