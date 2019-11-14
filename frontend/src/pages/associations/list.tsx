import React from "react";
import { useAsync, IfPending, IfFulfilled, IfRejected } from "react-async";
import { PageTitle } from "../../utils/common";
import { api } from "../../service/apiService";
import { Card, CardBody, CardTitle } from "reactstrap";

export const AssociationList = () => {
    const state = useAsync({ promiseFn: api.associations.list() });
    return (
        <>
            <PageTitle>Associations</PageTitle>
            <IfPending state={state}>Loading...</IfPending>
            <IfRejected state={state}>
                {error => `Something went wrong: ${error.message}`}
            </IfRejected>
            <IfFulfilled state={state}>
                {associations => (
                    <div className={"row"}>
                        {associations.map(association => (
                            <Card
                                key={association.id}
                                className={"col-md-3 m-4"}
                            >
                                <CardBody>
                                    <CardTitle>{association.name}</CardTitle>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                )}
            </IfFulfilled>
        </>
    );
};
