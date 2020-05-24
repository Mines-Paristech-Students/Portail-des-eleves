import React from "react";
import { api, useBetterQuery } from "../../../services/apiService";
import { Link, useParams } from "react-router-dom";
import { PageTitle } from "../../utils/PageTitle";
import { LoadingAssociation } from "../Loading";
import { Page } from "../../../models/associations/page";
import { ErrorMessage } from "../../utils/ErrorPage";

export const AssociationShowPage = ({ association }) => {
    const { pageId } = useParams<{ pageId: string }>();
    const { data, status, error } = useBetterQuery<Page>(
        ["page.get", pageId],
        api.pages.get
    );

    if (status === "loading") return <LoadingAssociation />;
    else if (status === "error")
        return (
            <ErrorMessage>{`Une erreur est survenue: ${error}`}</ErrorMessage>
        );
    else if (data) {
        return (
            <div>
                <PageTitle>{data.title}</PageTitle>
                <p>
                    <Link
                        to={`/associations/${association.id}/pages/${pageId}/modifier`}
                    >
                        Editer
                    </Link>
                </p>
                <p>{data.text}</p>
            </div>
        );
    }

    return null;
};
