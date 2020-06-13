import React, { ReactElement } from "react";
import { api } from "../../../services/apiService";

import { PollVotingForm } from "./PollVotingForm";
import { PollResults } from "./PollResults";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { PollsBase } from "../PollsBase";
import { PageTitle } from "../../utils/PageTitle";
import { PollNoPolls } from "./PollNoPolls";
import { Pagination } from "../../utils/Pagination";
import { Poll } from "../../../models/polls";
import { PollsError } from "../PollsError";
import { PollsLoading } from "../PollsLoading";

const Content = ({ current, polls, paginationControl }) => {
    const cards: ReactElement[] = current
        ? [].concat(
              polls
                  .filter((poll) => poll.isActive && !poll.userHasVoted)
                  .map((poll) => <PollVotingForm poll={poll} />),
              polls
                  .filter((poll) => poll.isActive && poll.userHasVoted)
                  .map((poll) => <PollResults poll={poll} />)
          )
        : polls
              .filter((poll) => !poll.isActive && poll.hasBeenPublished)
              .map((poll) => <PollResults poll={poll} />);

    return (
        <Container>
            {cards.length > 0 ? (
                <Row>
                    {cards.map((pollCard, index) => (
                        <Col key={"poll-card-" + index} xs={{ span: 6 }}>
                            {pollCard}
                        </Col>
                    ))}
                </Row>
            ) : (
                <Row>
                    <Col key={"poll-card-empty"} xs={{ span: 6, offset: 3 }}>
                        <PollNoPolls />
                    </Col>
                </Row>
            )}

            {paginationControl}
        </Container>
    );
};

/**
 * Display a list of published polls.
 *
 * If `current` is `true`, only display the active polls...
 *   - if the user has not voted, display the poll as an `PollVotingForm`.
 *   - otherwise, display the poll as a `PollResult`.
 *
 * If `current` is `false`, only display the inactive polls...
 *   - always display the poll as a `PollResult`.
 */
export const ListPolls = ({ current }: { current?: boolean }) => (
    <PollsBase>
        <PageTitle>
            {current ? "Sondages en cours" : "Anciens sondages"}
        </PageTitle>
        <Pagination
            render={(polls: Poll[], paginationControl) => (
                <Content
                    current={current}
                    polls={polls}
                    paginationControl={paginationControl}
                />
            )}
            apiKey={[
                "polls.list",
                current
                    ? { is_active: true }
                    : { is_published: true, is_active: false },
            ]}
            apiMethod={api.polls.list}
            config={{ refetchOnWindowFocus: false }}
            paginationControlProps={{
                className: "justify-content-center mb-5",
            }}
            loadingElement={PollsLoading}
            errorElement={PollsError}
        />
    </PollsBase>
);
