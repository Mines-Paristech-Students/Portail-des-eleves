import React from "react";
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
    stateFilter,
    setStateFilter,
    formGroupProps,
}: {
    stateFilter: PollStateFilter;
    setStateFilter: (
        value:
            | ((prevState: PollStateFilter) => PollStateFilter)
            | PollStateFilter
    ) => void;
    formGroupProps?: any;
}) => {
    return (
        <Form.Group {...formGroupProps}>
            <Form.Label className="text-uppercase">Statut</Form.Label>

            <div className="custom-controls-stacked ml-4">
                <label className="custom-control custom-checkbox">
                    <input
                        className="custom-control-input"
                        type="checkbox"
                        checked={stateFilter.accepted}
                        onChange={() =>
                            setStateFilter({
                                ...stateFilter,
                                accepted: !stateFilter.accepted,
                            })
                        }
                    />
                    <span className="custom-control-label">Accepté</span>
                </label>
                <label className="custom-control custom-checkbox">
                    <input
                        className="custom-control-input"
                        type="checkbox"
                        checked={stateFilter.rejected}
                        onChange={() =>
                            setStateFilter({
                                ...stateFilter,
                                rejected: !stateFilter.rejected,
                            })
                        }
                    />
                    <span className="custom-control-label">Refusé</span>
                </label>
                <label className="custom-control custom-checkbox">
                    <input
                        className="custom-control-input"
                        type="checkbox"
                        checked={stateFilter.reviewing}
                        onChange={() =>
                            setStateFilter({
                                ...stateFilter,
                                reviewing: !stateFilter.reviewing,
                            })
                        }
                    />
                    <span className="custom-control-label">En attente</span>
                </label>
            </div>
        </Form.Group>
    );
};
