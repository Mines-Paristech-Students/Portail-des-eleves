import React from "react";
import { PageTitle } from "../utils/PageTitle";
import { api } from "../../services/apiService";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { Pagination } from "../utils/Pagination";

export const AssociationList = () => (
    <Container>
        <PageTitle>Associations</PageTitle>
        <Pagination
            apiKey={["associations.list"]}
            apiMethod={api.associations.list}
            render={(associations, paginationControl) => (
                <>
                    {associations.map((association) => (
                        <Card key={association.id} className={"col-md-3 m-4"}>
                            <Link to={`/associations/${association.id}/`}>
                                <Card.Body>
                                    <Card.Title>{association.name}</Card.Title>
                                </Card.Body>
                            </Link>
                        </Card>
                    ))}
                    {paginationControl}
                </>
            )}
        />
    </Container>
);
