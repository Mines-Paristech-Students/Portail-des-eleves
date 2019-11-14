import React from "react";
import { SideBar, SideBarItem } from "../../utils/sidebar";
import { useParams } from "react-router-dom";
import { api } from "../../service/apiService";
import { useAsync, IfPending, IfRejected, IfFulfilled } from "react-async";

const AssociationSidebar = ({ association }) => {
    return (
        <SideBar title={association.name}>
            <SideBarItem to={"pages"} icon={"people"}>
                Pages
            </SideBarItem>
        </SideBar>
    );
};

export const AssociationMain = () => {
    let { associationId } = useParams();
    const state = useAsync({
        promiseFn: api.associations.get(associationId)
    });

    return (
        <>
            <p>coucou</p>
            <IfPending state={state}>Loading...</IfPending>
            <IfRejected state={state}>
                {error => `Something went wrong: ${error.message}`}
            </IfRejected>
            <IfFulfilled state={state}>
                {association => (
                    <AssociationSidebar association={association}/>
                )}
            </IfFulfilled>
        </>
    );
};
