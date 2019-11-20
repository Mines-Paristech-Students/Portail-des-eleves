import React from "react";
import { useAsync, IfPending, IfFulfilled, IfRejected } from "react-async";
import { PageTitle } from "../../utils/common";
import { apiService } from "../../service/apiService";
import { AxiosResponse } from "axios";
import { Association } from "../../models/associations/association";
import { Card, CardBody, CardTitle } from "reactstrap";

const loadAssociations = async () => {
    return apiService
        .get("associations/associations/")
        .then((response: AxiosResponse<Association[]>) => {
            return response.data;
        });
};

export const AssociationList = () => {
    const state = useAsync({ promiseFn: loadAssociations });
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
                            <Card key={association.id} className={"col-md-3 m-4"}>
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
