import React from "react";
import { api, useBetterQuery } from "../../../services/apiService";
import { Link, useParams } from "react-router-dom";
import { PageTitle } from "../../../utils/common";
import { LoadingAssociation } from "../Loading";
import { Page } from "../../../models/associations/page";

export const AssociationShowPage = ({ association }) => {
    const { pageId } = useParams<{pageId: string}>();
    const { data, status, error } = useBetterQuery<Page>(
        "page.get", api.pages.get, pageId
    );

    if (status === 'loading') return <LoadingAssociation/>;
    else if (status === 'error') return `Something went wrong: ${error}`;
    else if (data) {
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
