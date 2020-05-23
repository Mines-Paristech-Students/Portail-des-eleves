import React, { useContext, useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { api } from "../../../services/apiService";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { LoadingAssociation } from "../Loading";
import { PageTitle } from "../../utils/PageTitle";
import { Pagination } from "../../utils/Pagination";
import { Association } from "../../../models/associations/association";
import { EventCard } from "./EventCard";
import { UserContext } from "../../../services/authService";
import { SidebarOption } from "../../utils/sidebar/interfaces";

export const AssociationEventList = ({
    association,
    setSidebar,
}: {
    association: Association;
    setSidebar: (
        value:
            | ((prevState: SidebarOption | null) => SidebarOption | null)
            | SidebarOption
            | null
    ) => void;
}) => {
    const user = useContext(UserContext);
    const [parameters, setParameters] = useState<{
        association: string;
        time: ("NOW" | "BEFORE" | "AFTER")[];
    }>({
        association: association.id,
        time: [],
    });

    useEffect(() => {
        setSidebar({
            notifyChange: (sidebarParameters) => {
                const time: ("NOW" | "BEFORE" | "AFTER")[] = [];

                if (sidebarParameters["date.before"]) {
                    time.push("BEFORE");
                }

                if (sidebarParameters["date.now"]) {
                    time.push("NOW");
                }

                if (sidebarParameters["date.after"]) {
                    time.push("AFTER");
                }

                setParameters((oldParameters) => ({
                    ...oldParameters,
                    time: time,
                }));
            },
            searchable: false,
            sections: [
                {
                    title: "Voir les événements…",
                    id: "date",
                    retractable: false,
                    fields: [
                        {
                            type: "checkbox",
                            id: "before",
                            label: "Terminés",
                            defaultValue: false,
                        },
                        {
                            type: "checkbox",
                            id: "now",
                            label: "En cours",
                            defaultValue: true,
                        },
                        {
                            type: "checkbox",
                            id: "after",
                            label: "À venir",
                            defaultValue: true,
                        },
                    ],
                },
            ],
        });
    }, [setParameters, setSidebar]);

    return (
        <Pagination
            apiKey={["events.list", parameters]}
            apiMethod={api.events.list}
            loadingElement={LoadingAssociation}
            paginationControlProps={{
                className: "justify-content-center mb-5",
            }}
            render={(events, paginationControl) => (
                <Container className="mt-5">
                    <PageTitle>Événements</PageTitle>

                    {association.myRole.permissions.includes("media") && (
                        <Link
                            to={`/associations/${association.id}/evenements/nouveau`}
                            className={"btn btn-success float-right mt-5"}
                        >
                            <i className="fe fe-upload" />
                            Ajouter un évenement
                        </Link>
                    )}

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
    );
};
