import React from 'react';
import {PollsBreadcrumbBar} from "./PollsBreadcrumbBar";
import {ActionBar} from "../ActionBar";
import {LinkData} from "../../utils/link_data";
import {useListUserPollsService} from "../../services/polls";
import {APIServiceStatus} from "../../services/api_service";
import {PollsTable} from "./polls_table/PollsTable";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

export function ListUserPolls() {
    const actions: Array<LinkData> = [
        {
            name: "Proposer",
            to: "../proposer/",
        },
    ];

    const breadcrumbs: Array<LinkData> = [
        {
            name: "Mes sondages",
            to: "#",
        }
    ];

    const service = useListUserPollsService();

    function renderContent(): React.ReactElement {
        switch (service.status) {
            case APIServiceStatus.Loading:
                return <Spinner animation="border" role="status"/>;
            case APIServiceStatus.Loaded:
                return <PollsTable polls={service.payload}/>;
            case APIServiceStatus.Error:
                return <p>{service.error.message}</p>
        }
    }

    return (
        <>
            <PollsBreadcrumbBar breadcrumbs={breadcrumbs}/>
            <ActionBar actions={actions}/>
            <Card>
                <Card.Header>
                    <Card.Title>Mes sondages</Card.Title>
                </Card.Header>
                <Card.Body>
                    {renderContent()}
                </Card.Body>
            </Card>
        </>
    );
}
