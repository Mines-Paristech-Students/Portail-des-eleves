import React from 'react';
import {PollsBreadcrumbBar} from "./PollsBreadcrumbBar";
import {LinkData} from "../../utils/LinkData";
import {ActionBar} from "../ActionBar";
import {useListPollService} from "../../services/polls";
import {APIServiceStatus} from "../../services/api_service";
import {Col, Container, Row, Spinner} from "reactstrap";
import {ActivePoll} from "./list_published_polls/ActivePoll";
import {InactivePoll} from "./list_published_polls/InactivePoll";

export function ListPublishedPolls() {
    const actions: Array<LinkData> = [
        {
            name: "Mes sondages",
            to: "sondages/mes-sondages/",
        },
        {
            name: "Proposer",
            to: "sondages/proposer/",
        },
    ];

    const listService = useListPollService();

    function renderContent(): React.ReactElement {
        switch (listService.status) {
            case APIServiceStatus.Loading:
                return <Spinner color="primary"/>;
            case APIServiceStatus.Loaded:
                return renderLoadedPolls();
            case APIServiceStatus.Error:
                return <p>{listService.error.message}</p>
        }
    }

    function renderLoadedPolls(): React.ReactElement {
        if (listService.status === APIServiceStatus.Loaded) {
            const activePollCards = listService.payload
                .filter(poll => poll.isActive)
                .map(poll => <ActivePoll poll={poll}/>);

            const inactivePollCards = listService.payload
                .filter(poll => !poll.isActive)
                .map(poll => <InactivePoll poll={poll}/>);

            return (
                <>
                    <h2>
                        {activePollCards.length == 1 ? "Sondage ouvert" : "Sondages ouverts"}
                    </h2>
                    <Container>
                        <Row>
                            {activePollCards.map(pollCard => <Col xs={{size: 4, offset: 4}}>{pollCard}</Col>)}
                        </Row>
                    </Container>

                    <h2>
                        {inactivePollCards.length == 1 ? "Ancien sondage" : "Anciens sondages"}
                    </h2>
                    <Container>
                        <Row>
                            {inactivePollCards.map(pollCard => <Col xs={{size: 6, offset: 3}}>{pollCard}</Col>)}
                        </Row>
                    </Container>
                </>
            );
        }

        return <></>
    }

    return (
        <>
            <PollsBreadcrumbBar/>
            <ActionBar actions={actions}/>
            {renderContent()}
        </>
    );
}
