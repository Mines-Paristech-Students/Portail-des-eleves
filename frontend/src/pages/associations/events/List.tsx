import React from "react";
import { useQuery } from "react-query";
import { Link, useHistory } from "react-router-dom";
import { api } from "../../../services/apiService";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import { Col } from "react-bootstrap";
import { PageTitle } from "../../../utils/common";
import { Tag } from "../../../utils/Tag";
import { LoadingAssociation } from "../Loading";
import {Badge} from "react-bootstrap/";

export const AssociationListEvent = ({ association, ...props }) => {
    
    const associationId = association.id;
    const { data, isLoading, error } = useQuery(
        ["events.get", { associationId }],
        api.events.list
    );
    const history = useHistory();
    
    console.log(isLoading);

    let addButton;
    if (association.myRole.mediaPermission) {
        // TODO : Modify this add button
        addButton = (
            <Link
                to={`/associations/${association.id}/events/new`}
                className={"btn btn-success float-right mt-5"}
            >
                <i className="fe fe-upload" />
                Ajouter des fichiers
            </Link>
        );
    }

    if (isLoading) return <LoadingAssociation/>;
    if (error) return `Something went wrong: ${error.message}`;
    if (data) {
        return (
            <>
                {addButton}
                <PageTitle className={"mt-6"}>Evenements</PageTitle>
                <Row>
                    {data.map(event => {
                        return (
                            <Col md={4} key={event.id}>
                                <Card className="p-2">
                                    <Card.Header>
                                        <Card.Title>
                                            {/* TODO : icon that changes based on the request of the user
                                            The icon changes from plus-circle to check-circle
                                            Maibe arrow-up-circle for the loading of the request ?  */}
                                            {event.name}
                                        </Card.Title>
                                    </Card.Header>
                                    <Card.Body className="p-2">
                                        <Row>
                                            <Col className="my-auto">
                                                <div className="avatar-list avatar-list-stacked">
                                                    <span className="avatar">EB</span>
                                                        {/* Do an asynchronous request to display the person's images */}
                                                    <span 
                                                        className="avatar" 
                                                        style={{
                                                            backgroundImage: "url(./static/avatars/016f.jpg)"
                                                        }}></span>
                                                    <span className="avatar">{"+8"}</span>
                                                </div>
                                            </Col>
                                            <Col className="my-auto">
                                                <Link
                                                        to={`/associations/${association.id}/files/upload`}
                                                        className={"btn btn-success"}
                                                        >
                                                        <i className="fe fe-check-circle mr-2" />
                                                        S'inscrire
                                                </Link>
                                            </Col>
                                        </Row>
                                        
                                        {/* Add a list of images */}
                                    </Card.Body>
                                    <Card.Body>
                                        {/* Format the date */}
                                        {event.description}
                                        <div>
                                            <br/>
                                            <Badge pill variant="primary">De {event.startsAt.toString()}</Badge>
                                            <Badge pill variant="primary">A {event.startsAt.toString()}</Badge>
                                            <Badge pill variant="primary">{event.place.toString()}</Badge>
                                        </div>
                                    </Card.Body>
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