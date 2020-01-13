import React from "react";
import { PageTitle } from "../../utils/common";
import { api } from "../../services/apiService";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";

export const AssociationList = () => {
    const { data: associations, isLoading, error } = useQuery(
        "associations.list",
        api.associations.list
    );

    if (isLoading) return "Loading...";
    if (error) {
        return `Something went wrong: ${error.message}`;
    }
    if (associations) {
        return (
            <>
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
            </>
        );
    }

    return null;
};
