import React from "react";
import { api, useBetterQuery } from "../../../services/apiService";

import { ActivePoll } from "./ActivePoll";
import { InactivePoll } from "./InactivePoll";
import { Poll, PollState } from "../../../models/polls";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { pluralFormatter } from "../../../utils/format";
import { PollsBase } from "../PollsBase";
import { PageTitle } from "../../../utils/common";

export function ListPublishedPolls() {
    const { data: polls, error, status } = useBetterQuery<Poll[]>(
        "polls.list",
        api.polls.list
    );

    function Content(): React.ReactElement | null {
        if (status === "loading")
            return <Spinner animation="border" role="status" />;
        else if (status === "error") {
            return <p>`Something went wrong: ${error}`</p>;
        } else if (status === "success" && polls) {
            const activePollCards = polls
                .filter(
                    poll => poll.isActive && poll.state === PollState.Accepted
                )
                .map(poll => <ActivePoll poll={poll} />);

            const inactivePollCards = polls
                .filter(
                    poll => !poll.isActive && poll.state === PollState.Accepted
                )
                .map(poll => <InactivePoll poll={poll} />);

            return (
                <Container>
                    <Row>
                        <Col>
                            <h2>
                                {pluralFormatter(
                                    activePollCards.length,
                                    "Sondage ouvert",
                                    "Sondages ouverts"
                                )}
                            </h2>
                        </Col>
                    </Row>

                    <Row>
                        {activePollCards.map((pollCard, index) => (
                            <Col
                                key={"active-poll-card-" + index}
                                xs={{ span: 6, offset: 3 }}
                            >
                                {pollCard}
                            </Col>
                        ))}
                    </Row>

                    <Row>
                        <Col>
                            <h2>
                                {pluralFormatter(
                                    inactivePollCards.length,
                                    "Ancien sondage",
                                    "Anciens sondages"
                                )}
                            </h2>
                        </Col>
                    </Row>

                    <Row>
                        {inactivePollCards.map((pollCard, index) => (
                            <Col key={"inactive-poll-card-" + index} xs={4}>
                                {pollCard}
                            </Col>
                        ))}
                    </Row>
                </Container>
            );
        }

        return null;
    }

    return (
        <PollsBase>
            <PageTitle>Sondages récents</PageTitle>
            <Content />
        </PollsBase>
    );
}
