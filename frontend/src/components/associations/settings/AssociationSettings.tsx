import React from "react";
import { AssociationNamespaceSettings } from "./AssociationNamespaceSettings";
import { PageTitle } from "../../utils/PageTitle";

export const AssociationSettings = ({ association }) => (
    <>
        <PageTitle>Préférences</PageTitle>
        <AssociationNamespaceSettings association={association} />
    </>
);
