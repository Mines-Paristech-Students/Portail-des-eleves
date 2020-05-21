import React from "react";
import { Link } from "react-router-dom";
import { api } from "../../../services/apiService";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { LoadingAssociation } from "../Loading";
import { PageTitle } from "../../utils/PageTitle";
import { Tag } from "../../utils/tags/Tag";
import { Pagination } from "../../utils/Pagination";
import { Association } from "../../../models/associations/association";

export const AssociationEventList = ({
    association,
}: {
    association: Association;
}) => (
    <Pagination
        apiKey={["events.get", { associationId: association.id }]}
        apiMethod={api.events.list}
        loadingElement={LoadingAssociation}
        render={(events, paginationControl) => (
            <Container>
                {association.myRole.permissions.includes("media") ? (
                    <Link
                        to={`/associations/${association.id}/evenements/nouveau`}
                        className={"btn btn-success float-right mt-5"}
                    >
                        <i className="fe fe-upload" />
                        Ajouter un évenement
                    </Link>
                ) : null}

                <PageTitle className="mt-6">Liste des évènement</PageTitle>

                <Row>
                    {events.map((event: Event | any) => {
                        return (
                            <Col md={4} key={event.id}>
                                <Card>
                                    <Card.Header>
                                        <Card.Title>
                                            <Row>
                                                <Col>
                                                    <strong>
                                                        {event.name}
                                                    </strong>
                                                </Col>
                                                <Col>
                                                    <Link
                                                        to={`/associations/${association.id}/evenements/${event.id}/editer`}
                                                        className={
                                                            "btn btn-success"
                                                        }
                                                    >
                                                        <i className="fe fe-edit" />
                                                    </Link>
                                                </Col>
                                            </Row>
                                        </Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col>
                                                <div className="avatar-list avatar-list-stacked">
                                                    {/* Todo: add avatars */}
                                                    <span className="avatar">
                                                        EB
                                                    </span>
                                                    <span className="avatar"></span>
                                                    <span className="avatar">
                                                        {"+8"}
                                                    </span>
                                                </div>
                                            </Col>
                                            <Col>
                                                {/* Todo: Register to the event */}
                                                <Link
                                                    to={`Todo`}
                                                    className={
                                                        "btn btn-success"
                                                    }
                                                >
                                                    <i className="fe fe-check-circle" />
                                                    S'inscrire
                                                </Link>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                    <Card.Body>
                                        {event.description}
                                        {/*{description, participants, startsAt, endsAt, place}*/}
                                    </Card.Body>
                                    <Card.Footer>
                                        <Row>
                                            <Tag
                                                type="blue"
                                                tag={`Début : event.startsAt`}
                                            />
                                        </Row>
                                        <Row>
                                            <Tag
                                                type="green"
                                                tag={`Fin : event.endsAt`}
                                            />
                                        </Row>
                                        <Row>
                                            <Tag
                                                type="red"
                                                tag={`Localisation: ${event.place}`}
                                            />
                                        </Row>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        )}
    />
);
