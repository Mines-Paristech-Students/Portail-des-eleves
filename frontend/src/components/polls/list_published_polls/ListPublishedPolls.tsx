import React from 'react';
import {useListPollsService} from "../../../services/polls";
import {APIServiceStatus} from "../../../services/api_service";

import {ActivePoll} from "./ActivePoll";
import {InactivePoll} from "./InactivePoll";
import {PollState} from "../../../models/polls";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {pluralFormatter} from "../../../utils/format";
import {PollsBase} from "../PollsBase";

export function ListPublishedPolls() {
    const service = useListPollsService();

    function Content(): React.ReactElement | null {
        switch (service.status) {
            case APIServiceStatus.Loading:
                return <Spinner animation="border" role="status"/>;
            case APIServiceStatus.Loaded:
                return <PublishedPolls/>;
            case APIServiceStatus.Error:
                return <p>{service.error.message}</p>
        }
    }

    function PublishedPolls(): React.ReactElement | null {
        if (service.status === APIServiceStatus.Loaded) {
            const activePollCards = service.payload
                .filter(poll => poll.isActive && poll.state === PollState.Accepted)
                .map(poll => <ActivePoll poll={poll}/>);

            const inactivePollCards = service.payload
                .filter(poll => !poll.isActive && poll.state === PollState.Accepted)
                .map(poll => <InactivePoll poll={poll}/>);

            return (
                <Container>
                    <Row>
                        <Col>
                            <h2>
                                {pluralFormatter(activePollCards.length, "Sondage ouvert", "Sondages ouverts")}
                            </h2>
                        </Col>
                    </Row>

                    <Row>
                        {activePollCards.map(
                            (pollCard, index) => <Col key={"active-poll-card-" + index}
                                                      xs={{span: 6, offset: 3}}>{pollCard}</Col>
                        )}
                    </Row>

                    <Row>
                        <Col>
                            <h2>
                                {pluralFormatter(inactivePollCards.length, "Ancien sondage", "Anciens sondages")}
                            </h2>
                        </Col>
                    </Row>

                    <Row>
                        {inactivePollCards.map(
                            (pollCard, index) => <Col key={"inactive-poll-card-" + index}
                                                      xs={4}>{pollCard}</Col>
                        )}
                    </Row>
                </Container>
            );
        }

        return null
    }

    return (
        <PollsBase title={<h1 className="page-title page-header mb-5">Sondages récents</h1>}>
            <Content/>
        </PollsBase>
    );
}
