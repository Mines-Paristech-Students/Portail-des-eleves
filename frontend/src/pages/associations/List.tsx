import React from "react";
import { PageTitle } from "../../utils/common";
import { api, useBetterQuery } from "../../services/apiService";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { Association } from "../../models/associations/association";

export const AssociationList = () => {
    const { data: associations, error, status } = useBetterQuery<Association[]>(
        "associations.list",
        api.associations.list
    );

    if (status === "loading") return <p>Chargement des associations</p>;
    else if (status === "error") {
        return `Something went wrong: ${error}`;
    } else if (status === "success" && associations) {
        return (
            <Container>
                <PageTitle>Associations</PageTitle>
                <Row>
                    {associations.map(association => (
                        <Card key={association.id} className={"col-md-3 m-4"}>
                            <Link to={`/associations/${association.id}/`}>
                                <Card.Body>
                                    <Card.Title>{association.name}</Card.Title>
                                </Card.Body>
                            </Link>
                        </Card>
                    ))}
                </Row>
            </Container>
        );
    }

    return null;
};
