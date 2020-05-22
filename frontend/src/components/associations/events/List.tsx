import React, { useContext } from "react";

import { Link } from "react-router-dom";
import { api } from "../../../services/apiService";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { LoadingAssociation } from "../Loading";
import { PageTitle } from "../../utils/PageTitle";
import { Pagination } from "../../utils/Pagination";
import { Association } from "../../../models/associations/association";
import { EventCard } from "./EventCard";
import { UserContext } from "../../../services/authService";

export const AssociationEventList = ({
    association,
}: {
    association: Association;
}) => {
    const user = useContext(UserContext);

    return (
        <Pagination
            apiKey={["events.list", { associationId: association.id }]}
            apiMethod={api.events.list}
            loadingElement={LoadingAssociation}
            render={(events, paginationControl) => (
                <Container className="mt-5">
                    {association.myRole.permissions.includes("media") && (
                        <Link
                            to={`/associations/${association.id}/evenements/nouveau`}
                            className={"btn btn-success float-right mt-5"}
                        >
                            <i className="fe fe-upload" />
                            Ajouter un évenement
                        </Link>
                    )}

                    <PageTitle className="mt-6">Événements</PageTitle>

                    <Row>
                        {events.map((event) => (
                            <Col
                                xs={12}
                                md={{ span: 10, offset: 1 }}
                                key={event.id}
                            >
                                <EventCard
                                    event={event}
                                    association={association}
                                    userId={user? user.id : undefined}
                                />
                            </Col>
                        ))}
                    </Row>
                </Container>
            )}
        />
    );
};
