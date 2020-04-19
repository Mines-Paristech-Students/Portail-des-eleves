import React, { ReactElement } from "react";
import { api, useBetterQuery } from "../../../services/apiService";

import { ActivePoll } from "./ActivePoll";
import { InactivePoll } from "./InactivePoll";
import { Poll } from "../../../models/polls";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { PollsBase } from "../PollsBase";
import { PageTitle } from "../../../utils/common";
import { Link } from "react-router-dom";

type Props = {
    active?: boolean;
};

export function ListPolls(props: Props) {
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
            let pollCards: ReactElement[];

            if (props.active) {
                pollCards = polls
                    .filter(poll => poll.isActive)
                    .map(poll => <ActivePoll poll={poll} />);
            } else {
                pollCards = polls
                    .filter(poll => !poll.isActive && poll.hasBeenPublished)
                    .map(poll => <InactivePoll poll={poll} />);
            }

            return (
                <Container>
                    {pollCards.length > 0 ? (
                        <Row>
                            {pollCards.map((pollCard, index) => (
                                <Col
                                    key={"poll-card-" + index}
                                    xs={{ span: 6, offset: 3 }}
                                >
                                    {pollCard}
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Row>
                            <p>
                                Pour un monde meilleur,{" "}
                                <Link to="/sondages/proposer">
                                    propose un sondage
                                </Link>
                                .
                            </p>
                        </Row>
                    )}
                </Container>
            );
        }

        return null;
    }

    return (
        <PollsBase>
            <PageTitle>
                {props.active ? "Sondages en cours" : "Anciens sondages"}
            </PageTitle>
            <Content />
        </PollsBase>
    );
}
