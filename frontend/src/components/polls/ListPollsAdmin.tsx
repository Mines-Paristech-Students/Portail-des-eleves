import React from 'react';
import {LinkData} from "../../utils/link_data";
import {useListPollsServiceAdmin} from "../../services/polls";
import {APIServiceStatus} from "../../services/api_service";
import {PollsTable} from "./polls_table/PollsTable";
import {PollsBreadcrumbBar} from "./PollsBreadcrumbBar";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

export function ListPollsAdmin() {
    const breadcrumbs: Array<LinkData> = [
        {
            name: "Administration",
            to: "#",
        }
    ];

    const service = useListPollsServiceAdmin();

    function renderContent(): React.ReactElement {
        switch (service.status) {
            case APIServiceStatus.Loading:
                return <Spinner animation="border" role="status"/>;
            case APIServiceStatus.Loaded:
                return <PollsTable polls={service.payload} adminVersion/>;
            case APIServiceStatus.Error:
                return <p>{service.error.message}</p>
        }
    }

    return (
        <>
            <PollsBreadcrumbBar breadcrumbs={breadcrumbs}/>
            <Card>
                <Card.Header>
                    <Card.Title>Administration</Card.Title>
                </Card.Header>
                <Card.Body>
                    {renderContent()}
                </Card.Body>
            </Card>
        </>
    );
}
