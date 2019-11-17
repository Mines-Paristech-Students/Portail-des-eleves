import React from "react";
import { PageTitle } from "../../utils/common";
import { api } from "../../services/apiService";
import { Card, CardBody, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

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
                <div className={"row"}>
                    {associations.map(association => (
                        <Card key={association.id} className={"col-md-3 m-4"}>
                            <Link to={`/associations/${association.id}/`}>
                                <CardBody>
                                    <CardTitle>{association.name}</CardTitle>
                                </CardBody>
                            </Link>
                        </Card>
                    ))}
                </div>
            </>
        );
    }

    return null;
};
