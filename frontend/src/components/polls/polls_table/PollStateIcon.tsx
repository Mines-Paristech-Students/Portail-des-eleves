import { PollState } from "../../../models/polls";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export const PollStateIcon = ({ state }: { state: PollState }) => {
    switch (state) {
        case PollState.Accepted:
            return (
                <OverlayTrigger
                    placement={"bottom"}
                    overlay={<Tooltip id="accepted">Accepté</Tooltip>}
                >
                    <i className="fe fe-check text-success" />
                </OverlayTrigger>
            );
        case PollState.Rejected:
            return (
                <OverlayTrigger
                    placement={"bottom"}
                    overlay={<Tooltip id="accepted">Refusé</Tooltip>}
                >
                    <i className="fe fe-x text-danger" />
                </OverlayTrigger>
            );
        case PollState.Reviewing:
            return (
                <OverlayTrigger
                    placement={"bottom"}
                    overlay={<Tooltip id="accepted">En attente</Tooltip>}
                >
                    <i className="fe fe-eye text-warning" />
                </OverlayTrigger>
            );
    }
};
