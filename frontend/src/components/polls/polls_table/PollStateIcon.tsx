import { PollState } from "../../../models/polls";
import React from "react";

export const PollStateIcon = ({ state }: { state: PollState }) => {
    switch (state) {
        case PollState.Accepted:
            return <i className="fe fe-check text-success"/>;
        case PollState.Rejected:
            return <i className="fe fe-x text-danger"/>;
        case PollState.Reviewing:
            return <i className="fe fe-eye text-warning"/>;
    }
};
