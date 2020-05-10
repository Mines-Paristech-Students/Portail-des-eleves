import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { joinNonEmpty } from "../../../utils/parameter";

export type PollStateFilter = {
    accepted: boolean;
    rejected: boolean;
    reviewing: boolean;
};

export const hasPollStateFilter = (filter: PollStateFilter) => {
    return filter.accepted || filter.rejected || filter.reviewing;
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
            filter.reviewing ? "REVIEWING" : ""
        ],
        "&state="
    )}`;

export const PollsTableFilter = ({
    defaultStateFilter,
    setStateFilter,
    formGroupProps
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
            reviewing: reviewing
        });
    }, [accepted, rejected, reviewing]);

    return (
        <Form.Group {...formGroupProps}>
            <Form.Label className={"d-none"}>Filtre</Form.Label>

            <div className="selectgroup selectgroup-pills">
                <label className="selectgroup-item">
                    <input
                        className="selectgroup-input"
                        type="checkbox"
                        checked={accepted}
                        onChange={() => setAccepted(!accepted)}
                    />
                    <span className="selectgroup-button selectgroup-button-icon">
                        <i className="fe fe-check text-success" />
                    </span>
                </label>
                <label className="selectgroup-item">
                    <input
                        className="selectgroup-input"
                        type="checkbox"
                        checked={rejected}
                        onChange={() => setRejected(!rejected)}
                    />
                    <span className="selectgroup-button selectgroup-button-icon">
                        <i className="fe fe-x text-danger" />
                    </span>
                </label>
                <label className="selectgroup-item">
                    <input
                        className="selectgroup-input"
                        type="checkbox"
                        checked={reviewing}
                        onChange={() => setReviewing(!reviewing)}
                    />
                    <span className="selectgroup-button selectgroup-button-icon">
                        <i className="fe fe-eye text-warning" />
                    </span>
                </label>
            </div>
        </Form.Group>
    );
};
