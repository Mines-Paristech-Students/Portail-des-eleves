import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { joinNonEmpty } from "../../../utils/parameter";

export type PollStateFilter = {
    accepted: boolean;
    rejected: boolean;
    reviewing: boolean;
};

/**
 * Build an URL filtering parameter from a `PollStateFilter` object.
 *
 * @param filter a PollStateFilter object.
 * @param parameterName the name of the URL parameter. Defaults to `state`.
 */
export const pollStateFilterToApiParameter = (
    filter: PollStateFilter,
    parameterName: string = "state"
) =>
    `${parameterName}=${joinNonEmpty(
        [
            filter.accepted ? "ACCEPTED" : "",
            filter.rejected ? "REJECTED" : "",
            filter.reviewing ? "REVIEWING" : "",
        ],
        "&state="
    )}`;

export const PollsTableFilter = ({
    defaultStateFilter,
    setStateFilter,
    formGroupProps,
}: {
    defaultStateFilter: PollStateFilter;
    setStateFilter: (
        value:
            | ((prevState: PollStateFilter) => PollStateFilter)
            | PollStateFilter
    ) => void;
    formGroupProps?: any;
}) => {
    const [accepted, setAccepted] = useState(defaultStateFilter.accepted);
    const [rejected, setRejected] = useState(defaultStateFilter.rejected);
    const [reviewing, setReviewing] = useState(defaultStateFilter.reviewing);

    useEffect(() => {
        setStateFilter({
            accepted: accepted,
            rejected: rejected,
            reviewing: reviewing,
        });
    }, [accepted, rejected, reviewing]);

    return (
        <Form.Group {...formGroupProps}>
            <Form.Label className="text-uppercase">Statut</Form.Label>

            <div className="custom-controls-stacked ml-4">
                <label className="custom-control custom-checkbox">
                    <input
                        className="custom-control-input"
                        type="checkbox"
                        checked={accepted}
                        onChange={() => setAccepted(!accepted)}
                    />
                    <span className="custom-control-label">Accepté</span>
                </label>
                <label className="custom-control custom-checkbox">
                    <input
                        className="custom-control-input"
                        type="checkbox"
                        checked={rejected}
                        onChange={() => setRejected(!rejected)}
                    />
                    <span className="custom-control-label">Refusé</span>
                </label>
                <label className="custom-control custom-checkbox">
                    <input
                        className="custom-control-input"
                        type="checkbox"
                        checked={reviewing}
                        onChange={() => setReviewing(!reviewing)}
                    />
                    <span className="custom-control-label">En attente</span>
                </label>
            </div>
        </Form.Group>
    );
};
