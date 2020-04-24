import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { api } from "../../../services/apiService";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import { Col } from "react-bootstrap";
import { PageTitle } from "../../../utils/common";
import { Tag } from "../../../utils/Tag";
import { LoadingAssociation } from "../Loading";
import moment from "moment";

export const AssociationEventList = ({ association, ...props }) => {
    
    const associationId = association.id;
    const { data, isLoading, error } = useQuery<Event[], any>(
        ["events.get", { associationId }],
        api.events.list
    );

    let addButton;
    if (association.myRole.mediaPermission) {
        // TODO : Modify this add button
        // Should check whether we have the max number of participants
        addButton = (
            <Link
                to={`/associations/${association.id}/events/new`}
                className={"btn btn-success float-right mt-5"}
            >
                <i className="fe fe-upload" />
                Ajouter un évenement
            </Link>
        );
    }

    if (isLoading) return <LoadingAssociation/>;
    if (error) return `Something went wrong: ${error.message}`;
    if (data) {
        return (
            <>
                {addButton}
                <PageTitle className="mt-6">Liste des évènement</PageTitle>
                <Row>
                    {data.map((event: Event | any) => {
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
                                                        to={`/associations/${association.id}/events/${event.id}/edit`}
                                                        className={"btn btn-success"}
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
                                                    <span className="avatar">EB</span>
                                                    <span className="avatar"></span>
                                                    <span className="avatar">{"+8"}</span>
                                                </div>
                                            </Col>
                                            <Col>
                                                {/* Todo: Register to the event */}
                                                <Link
                                                    to={`Todo`}
                                                    className={"btn btn-success"}
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
                                        <Row><Tag type="blue" tag={`Début: ${moment(event.startsAt).format('MMMM Do YYYY, h:mm:ss a')}`} /></Row>
                                        <Row><Tag type="green" tag={`Fin: ${moment(event.endsAt).format('MMMM Do YYYY, h:mm:ss a')}`} /></Row>
                                        <Row><Tag type="red" tag={`Localisation: ${event.place}`} /></Row>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        )
                    }
                    )}
                </Row>

            </>
        );
    };

    return null;
};
