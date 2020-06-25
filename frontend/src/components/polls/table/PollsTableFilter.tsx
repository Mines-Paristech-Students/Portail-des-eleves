import React from "react";
import Form from "react-bootstrap/Form";

export type PollStateFilter = {
  accepted: boolean;
  rejected: boolean;
  reviewing: boolean;
};

/**
 * Convert a `PollStateFilter` object into an array ready to be fed into
 * `toUrlParams`.
 *
 * @param filter a PollStateFilter object.
 */
export const pollStateFilterToApiParameter = (filter: PollStateFilter) => {
  let r: ("REVIEWING" | "REJECTED" | "ACCEPTED")[] = [];

  if (filter.accepted) {
    r.push("ACCEPTED");
  }

  if (filter.rejected) {
    r.push("REJECTED");
  }

  if (filter.reviewing) {
    r.push("REVIEWING");
  }

  return r;
};

export const PollsTableFilter = ({
  stateFilter,
  setStateFilter,
  formGroupProps,
}: {
  stateFilter: PollStateFilter;
  setStateFilter: (
    value: ((prevState: PollStateFilter) => PollStateFilter) | PollStateFilter
  ) => void;
  formGroupProps?: any;
}) => (
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
