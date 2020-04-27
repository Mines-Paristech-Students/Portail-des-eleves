import React, { ReactElement } from "react";
import { api, useBetterQuery } from "../../../services/apiService";

import { PollVotingForm } from "./PollVotingForm";
import { PollResults } from "./PollResults";
import { Poll } from "../../../models/polls";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { PollsBase } from "../PollsBase";
import { PageTitle } from "../../../utils/common";
import { PollsLoading } from "../PollsLoading";
import { PollsError } from "../PollsError";
import { PollNoPolls } from "./PollNoPolls";


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
export const ListPolls = ({ current }: { current?: boolean }) => {
    const { data: polls, error, status, refetch } = useBetterQuery<Poll[]>(
        "polls.list",
        api.polls.list,
        [],
        { refetchOnWindowFocus: false }
    );

    function Content(): React.ReactElement | null {
        if (status === "loading")
            return <PollsLoading/>;
        else if (status === "success" && polls) {
            let cards: ReactElement[] = [];

            if (current) {
                cards = cards.concat(
                    polls
                        .filter(poll => poll.isActive && !poll.userHasVoted)
                        .map(poll => <PollVotingForm poll={poll}
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
                                <Col key={"poll-card-" + index}
                                     xs={{ span: 6 }}>
                                    {pollCard}
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Row>
                            <Col key={"poll-card-empty"}
                                 xs={{ span: 6, offset: 3 }}>
                                <PollNoPolls/>
                            </Col>
                        </Row>
                    )}
                </Container>
            );
        } else {
            return <PollsError detail={error}/>;
        }
    }

    return (
        <PollsBase>
            <PageTitle>
                {current ? "Sondages en cours" : "Anciens sondages"}
            </PageTitle>
            <Content/>
        </PollsBase>
    );
};
