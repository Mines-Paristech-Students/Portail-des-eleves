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

    return status === "loading" ? (
        <LoadingAssociation />
    ) : status === "error" ? (
        <ErrorMessage>{`Une erreur est survenue: ${error}`}</ErrorMessage>
    ) : data ? (
        <AssociationPageRenderer association={association} page={data} />
    ) : null;
};

export const AssociationPageRenderer = ({ association, page }) => (
    <>
        <PageTitle>{page.title}</PageTitle>
        <p>
            <Link
                to={`/associations/${association.id}/pages/${page.id}/modifier`}
            >
                Editer
            </Link>
        </p>
        <p>{page.text}</p>
    </>
);
