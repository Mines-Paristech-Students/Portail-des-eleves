import React, { ReactElement } from "react";
import { api, useBetterQuery } from "../../../services/apiService";

import { OpenPoll } from "./OpenPoll";
import { PollResults } from "./PollResults";
import { Poll } from "../../../models/polls";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { PollsBase } from "../PollsBase";
import { PageTitle } from "../../../utils/common";
import { Link } from "react-router-dom";

type Props = {
    current?: boolean;
};

/**
 * Display a list of published polls.
 *
 * If `props.current` is `true`, only display the active polls...
 *   - if the user has not voted, display the poll as an `OpenPoll`.
 *   - otherwise, display the poll as a `PollResult`.
 *
 * If `props.current` is `false`, only display the inactive polls...
 *   - always display the poll as a `PollResult`.
 */
export function ListPolls(props: Props) {
    const { data: polls, error, status, refetch } = useBetterQuery<Poll[]>(
        "polls.list",
        api.polls.list,
        [],
        {refetchOnWindowFocus: false}
    );

    function Content(): React.ReactElement | null {
        if (status === "loading")
            return <Spinner animation="border" role="status"/>;
        else if (status === "error") {
            return <p>`Something went wrong: ${error}`</p>;
        } else if (status === "success" && polls) {
            let cards: ReactElement[] = [];

            if (props.current) {
                cards = cards.concat(
                    polls
                        .filter(poll => poll.isActive && !poll.userHasVoted)
                        .map(poll => <OpenPoll poll={poll}
                                               refetch={refetch}/>),
                    polls
                        .filter(poll => poll.isActive && poll.userHasVoted)
                        .map(poll => <PollResults poll={poll}/>)
                );
            } else {
                cards = polls
                    .filter(poll => !poll.isActive && poll.hasBeenPublished)
                    .map(poll => <PollResults poll={poll}/>);
            }

            return (
                <Container>
                    {cards.length > 0 ? (
                        <Row>
                            {cards.map((pollCard, index) => (
                                <Col
                                    key={"poll-card-" + index}
                                    xs={{ span: 6 }}
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
                {props.current ? "Sondages en cours" : "Anciens sondages"}
            </PageTitle>
            <Content/>
        </PollsBase>
    );
}
