import React from "react";
import { useParams } from "react-router-dom";

import { api, useBetterQuery } from "../../services/apiService";
import { ErrorMessage } from "../utils/ErrorPage";
import { Association } from "../../models/associations/association";
import { Loading } from "../utils/Loading";
import { AssociationLayout } from "./Layout";

/**
 * A generic component to query the association object from the match and
 * also add a generic layout if needed
 * @param render the component childrens to render
 * @param match React-router match object
 * @param props any additional prop
 */
export const AssociationBoostrap = ({
    render: Render,
    useDefaultLayout,
    match,
    ...props
}) => {
    const { associationId } = useParams<{ associationId: string }>();

    const { data: association, error, status } = useBetterQuery<Association>(
        ["association.get", associationId],
        api.associations.get,
        {
            refetchOnWindowFocus: false,
        }
    );

    // Render
    return status === "loading" ? (
        <Loading />
    ) : status === "error" ? (
        <ErrorMessage>`Une erreur est apparue: ${error}`</ErrorMessage>
    ) : status === "success" && association ? (
        useDefaultLayout ? (
            <AssociationLayout association={association}>
                <Render association={association} {...props} />
            </AssociationLayout>
        ) : (
            <Render association={association} {...props} />
        )
    ) : null;
};
