import React from "react";
import { PageTitle } from "../../../utils/common";
import { Page, PageType } from "../../../models/associations/page";

export const AssociationCreatePage = ({ association }) => {
    const page: Page = {
        title: "",
        text: "",
        authors: [],
        creationDate: new Date(),
        lastUpdateDate: new Date(),
        tags: [],
        association: association.id,
        pageType: PageType.Static
    };

    return (
        <div>
            <PageTitle>New Page</PageTitle>
            <EditPage page={page}/>
        </div>
    );
};

const EditPage = ({ page }) => {
    return <p>Edit form</p>;
};
