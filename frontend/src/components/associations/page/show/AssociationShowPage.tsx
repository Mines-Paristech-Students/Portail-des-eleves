import React from "react";
import { api, useBetterQuery } from "../../../../services/apiService";
import { useParams } from "react-router-dom";
import { LoadingAssociation } from "../../Loading";
import { Page } from "../../../../models/associations/page";
import { ErrorMessage } from "../../../utils/ErrorPage";
import Container from "react-bootstrap/Container";
import { AssociationPageCard } from "./AssociationPageCard";

export const AssociationShowPage = ({ association }) => {
    const { pageId } = useParams<{ pageId: string }>();
    const { data: page, status, error } = useBetterQuery<Page>(
        ["page.get", pageId],
        api.pages.get
    );

    return status === "loading" ? (
        <LoadingAssociation />
    ) : status === "error" ? (
        <ErrorMessage>{`Une erreur est survenue: ${error}`}</ErrorMessage>
    ) : page ? (
        <Container className="mt-4">
            <AssociationPageCard association={association} page={page} />
        </Container>
    ) : null;
};
