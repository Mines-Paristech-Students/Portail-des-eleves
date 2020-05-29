import React, { useContext, useState } from "react";

import { api } from "../../../../services/apiService";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { LoadingAssociation } from "../../Loading";
import { PageTitle } from "../../../utils/PageTitle";
import { Pagination } from "../../../utils/Pagination";
import { Association } from "../../../../models/associations/association";
import { EventCard } from "./EventCard";
import { UserContext } from "../../../../services/authService";
import { AssociationLayout } from "../../Layout";
import {
    ListEventsSidebar,
    ListEventsSidebarParameters,
} from "./ListEventsSidebar";

/**
 * The API parameters are a bit different of the sidebar parameters and thus need to be transformed.
 */
const getParameters = (
    association: Association,
    sidebarParameters: ListEventsSidebarParameters
): {
    association: string;
    time: ("NOW" | "BEFORE" | "AFTER")[];
} => {
    const newTime: ("NOW" | "BEFORE" | "AFTER")[] = [];

    if (sidebarParameters.time.before) {
        newTime.push("BEFORE");
    }

    if (sidebarParameters.time.now) {
        newTime.push("NOW");
    }

    if (sidebarParameters.time.after) {
        newTime.push("AFTER");
    }

    return {
        association: association.id,
        time: newTime,
    };
};

export const AssociationListEvents = ({
    association,
}: {
    association: Association;
}) => {
    const user = useContext(UserContext);

    // By default, only the current and the coming events are displayed.
    const [sidebarParameters, setSidebarParameters] = useState<
        ListEventsSidebarParameters
    >({
        time: {
            before: false,
            now: true,
            after: true,
        },
    });

    return (
        <AssociationLayout
            association={association}
            additionalSidebar={
                <ListEventsSidebar
                    associationId={association.id}
                    parameters={sidebarParameters}
                    setParameters={setSidebarParameters}
                    adminVersion={
                        !!association.myRole &&
                        association.myRole.permissions?.includes("event")
                    }
                />
            }
        >
            <Pagination
                apiKey={[
                    "events.list",
                    // Transform the sidebar parameters into API parameters.
                    getParameters(association, sidebarParameters),
                ]}
                apiMethod={api.events.list}
                loadingElement={LoadingAssociation}
                paginationControlProps={{
                    className: "justify-content-center mb-5",
                }}
                render={(events, paginationControl) => (
                    <Container className="mt-5">
                        <PageTitle>Événements</PageTitle>

                        <Row>
                            {events.length > 0 ? (
                                events.map((event) => (
                                    <Col
                                        xs={12}
                                        md={{ span: 10, offset: 1 }}
                                        key={event.id}
                                    >
                                        <EventCard
                                            event={event}
                                            association={association}
                                            userId={user ? user.id : undefined}
                                        />
                                    </Col>
                                ))
                            ) : (
                                <Col xs={12} md={{ span: 10, offset: 1 }}>
                                    <Card>
                                        <Card.Body className="px-7">
                                            <p className="text-center">
                                                Pas d’événement pour le moment.{" "}
                                                <span
                                                    role="img"
                                                    aria-label="visage qui pleure"
                                                >
                                                    😢
                                                </span>
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )}
                        </Row>

                        {paginationControl}
                    </Container>
                )}
            />
        </AssociationLayout>
    );
};
