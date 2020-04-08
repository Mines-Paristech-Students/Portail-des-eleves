import React from "react";
import { api } from "../../../services/apiService";
import { Link, useParams } from "react-router-dom";
import { PageTitle } from "../../../utils/common";
import { useQuery } from "react-query";
import { LoadingAssociation } from "../Loading";
import { Page } from "../../../models/associations/page";

export const AssociationShowPage = ({ association }) => {
    const { pageId } = useParams();
    const { data, isLoading, error } = useQuery<Page, any>(
        ["page.get", {pageId}],
        api.pages.get
    );

    if (isLoading) return <LoadingAssociation/>;
    if (error) return `Something went wrong: ${error.message}`;
    if (data) {
        return (
            <div>
                <PageTitle>{data.title}</PageTitle>
                <p><Link to={`/associations/${association.id}/pages/${pageId}/edit`}>Editer</Link></p>
                <p>{data.text}</p>
            </div>
        );
    }

    return null;
};
