import React from "react";
import { api } from "../../../services/apiService";
import { useParams } from "react-router-dom";
import { PageTitle } from "../../../utils/common";
import { useQuery } from "react-query";

export const AssociationShowPage = ({ association }) => {
    const { pageId } = useParams();
    const { data, isLoading, error } = useQuery(
        ["page.get", {pageId}],
        api.pages.get
    );

    if (isLoading) return "Loading association...";
    if (error) return `Something went wrong: ${error.message}`;
    if (data) {
        return (
            <div>
                <PageTitle>{data.title}</PageTitle>
                <p>{data.text}</p>
            </div>
        );
    }

    return null;
};
