import React from "react";
import { PageTitle } from "../../utils/common";

export const AssociationHome = ({association}) => {
    if (!association){
        return "Homepage is loading...";
    }

    return <>
        <PageTitle>{association.name}</PageTitle>
        <p>Home page !!!</p>
    </>;
};
