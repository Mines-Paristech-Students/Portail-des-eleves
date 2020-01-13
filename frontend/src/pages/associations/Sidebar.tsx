import React from "react";
import { api } from "../../services/apiService";
import { Sidebar, SidebarItem } from "../../utils/Sidebar";
import { useQuery } from "react-query";

const ListPagesItem = ({ pages, association }) =>
    pages.map(page => (
        <SidebarItem
            icon={"book"}
            to={`/associations/${association.id}/pages/${page.id}`}
            key={page.id}
        >
            {page.title}
        </SidebarItem>
    ));

const AddPageItem = ({ association }) => {
    if (!association.myRole.pagePermission) {
        return null;
    }

    return (
        <SidebarItem
            icon={"plus"}
            to={`/associations/${association.id}/pages/new`}
        >
            Ajouter une page
        </SidebarItem>
    );
};

export const AssociationSidebar = ({ association }) => {
    const { data: pages, isLoading, error } = useQuery(
        ["pages.list", { associationId: association.id }],
        api.pages.list
    );

    if (isLoading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>Erreur lors du chargement</p>;
    }

    if (!pages) {
        return null;
    }

    return (
        <Sidebar title={association.name}>
            <ListPagesItem association={association} pages={pages} />
            <AddPageItem association={association} />
        </Sidebar>
    );
};
