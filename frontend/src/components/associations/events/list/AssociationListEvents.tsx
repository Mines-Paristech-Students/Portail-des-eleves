import React  from "react";

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

export const AssociationListEvents = ({
    association,
    title,
    time,
}: {
    association: Association;
    title: string;
    time: ("NOW" | "BEFORE" | "AFTER")[];
}) => (
    <Pagination
        apiKey={[
            "events.list",
            {
                association: association.id,
                time: time,
            },
        ]}
        apiMethod={api.events.list}
        loadingElement={LoadingAssociation}
        paginationControlProps={{
            className: "justify-content-center mb-5",
        }}
        render={(events, paginationControl) => (
            <Container className="mt-5">
                <PageTitle>{title}</PageTitle>

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
                                    canEdit={association.myRole?.permissions?.includes(
                                        "event"
                                    )}
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
);
