import React from "react";
import { api } from "../../services/apiService";
import { SideBar, SideBarItem } from "../../utils/sidebar";
import { useQuery } from "react-query";

const ListPagesItem = ({ pages, association }) =>
    pages.map(page => (
        <SideBarItem
            icon={"book"}
            to={`/associations/${association.id}/pages/${page.id}`}
            key={page.id}
        >
            {page.title}
        </SideBarItem>
    ));

const AddPageItem = ({ association }) => {
    if (!association.myRole.pagePermission) {
        return null;
    }

    return (
        <SideBarItem
            icon={"plus"}
            to={`/associations/${association.id}/pages/new`}
        >
            Ajouter une page
        </SideBarItem>
    );
};

export const AssociationSidebar = ({ association }) => {
    const { data: pages, isLoading, error } = useQuery(
        ["pages.list", { associationId: association.id }],
        api.pages.list
    );

    if (isLoading) {
        return <p>Loading</p>;
    }

    if (error) {
        return <p>Error while loading</p>;
    }

    if (!pages) {
        return null;
    }

    return (
        <SideBar title={association.name}>
            <ListPagesItem association={association} pages={pages} />
            <AddPageItem association={association} />
        </SideBar>
    );
};
