import React from "react";

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

/**
 * Display a list of `EventCard` filtered by `time` and ordered by either `-starts_at` or `starts_at`.
 * The whole component is placed in a `Container`.
 *
 * @param association the related association.
 * @param title displayed in a `PageTitle` component at the top.
 * @param time an array which elements are to choose between "NOW", "BEFORE" and "AFTER" used to filter the events out.
 * The empty array is equivalent to an empty filter (all the events are displayed).
 * @param ordering choose between `-starts_at` and `starts_at`.
 */
export const AssociationListEvents = ({
    association,
    title,
    time,
    ordering,
}: {
    association: Association;
    title: string;
    time: ("NOW" | "BEFORE" | "AFTER")[];
    ordering: "-starts_at" | "starts_at";
}) => (
    <Pagination
        apiKey={[
            "events.list",
            {
                association: association.id,
                time: time,
                ordering: ordering,
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
