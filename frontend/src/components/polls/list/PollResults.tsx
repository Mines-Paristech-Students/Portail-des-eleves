import React from "react";
import { Poll } from "../../../models/polls";
import { decidePlural } from "../../../utils/format";
import ProgressBar from "react-bootstrap/ProgressBar";
import ListGroup from "react-bootstrap/ListGroup";
import dayjs from "dayjs";

const totalNumberOfVotes = (poll) =>
  poll.choices.reduce(
    (total, choice) =>
      choice.numberOfVotes ? total + choice.numberOfVotes : total,
    0
  );

const getColor = (
  numberOfVotes: number,
  totalVotes: number
): "success" | "warning" | "danger" => {
  if (numberOfVotes > totalVotes / 2) {
    return "success";
  } else if (numberOfVotes > totalVotes / 3) {
    return "warning";
  }
  return "danger";
};

/**
 * Display the results of a Poll in a `Card`.
 * The question is the title of the card.
 * The results are displayed as progress bars, with colours depending on the
 * rank of the choice.
 */
export const PollResults = ({ poll }: { poll: Poll }) => (
  <>
    <h3 className={"text-center"}>{poll.question}</h3>
    <ListGroup>
      {poll.choices
        // Sort by descending number of votes.
        .sort((a, b) => a.text.localeCompare(b.text))
        .map((choice) =>
          choice.numberOfVotes !== undefined ? (
            <ListGroup.Item key={choice.id} className="border-0">
              <div className="clearfix">
                <div className="float-left">
                  <strong>{choice.text}</strong>
                </div>
                <div className="float-right text-muted">
                  <small>
                    {Number(
                      (100 * choice.numberOfVotes) / totalNumberOfVotes(poll)
                    ).toFixed(1)}{" "}
                    %
                  </small>
                </div>
              </div>
              <ProgressBar
                className="progress-sm"
                now={choice.numberOfVotes}
                min={0}
                max={totalNumberOfVotes(poll)}
                variant={getColor(
                  choice.numberOfVotes,
                  totalNumberOfVotes(poll)
                )}
              />
            </ListGroup.Item>
          ) : null
        )}
    </ListGroup>

    <p className="text-center text-muted">
      <em>
        {poll.publicationDate &&
          dayjs(poll.publicationDate).format("DD/MM/YYYY")}{" "}
        (
        {`${totalNumberOfVotes(poll)} ${decidePlural(
          totalNumberOfVotes(poll),
          "vote",
          "votes"
        )}`}
        )
      </em>
    </p>
  </>
);
