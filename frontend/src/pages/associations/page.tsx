import React from "react";
import { useAsync, IfPending, IfFulfilled, IfRejected } from "react-async";
import { PageTitle } from "../../utils/common";
import { api } from "../../service/apiService";
import { useParams } from "react-router-dom";

export const AssociationPage = () => {
    const { associationId, pageId } = useParams();

    const state = useAsync({
        promiseFn: api
            .association(associationId)
            .pages()
            .get(pageId as string)
    });
    return (
        <>
            <PageTitle>Associations</PageTitle>
            <IfPending state={state}>Loading...</IfPending>
            <IfRejected state={state}>
                {error => `Something went wrong: ${error.message}`}
            </IfRejected>
            <IfFulfilled state={state}>
                {page => (
                    <div>
                        <p>{page.title}</p>
                        <p>{page.text}</p>
                    </div>
                )}
            </IfFulfilled>
        </>
    );
};
