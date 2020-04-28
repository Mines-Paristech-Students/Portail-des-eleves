import React from "react";
import {
    api,
    PaginatedResponse,
    useBetterQuery
} from "../../services/apiService";
import { Sidebar, SidebarItem } from "../../utils/Sidebar";
import { Page } from "../../models/associations/page";

export const AssociationSidebar = ({ association }) => {
    const { data: pages, status, error } = useBetterQuery<
        PaginatedResponse<Page[]>
    >("pages.list", api.pages.list, association.id);

    if (status === "loading") {
        return <p>Chargement...</p>;
    } else if (error) {
        return <p>Erreur lors du chargement</p>;
    } else if (pages) {
        return (
            <Sidebar title={association.name}>
                <ListPagesItem
                    association={association}
                    pages={pages.results}
                />
                <AddPageItem association={association} />
                <SidebarItem
                    icon={"file"}
                    to={`/associations/${association.id}/files`}
                >
                    Fichiers
                </SidebarItem>
                <SidebarItem
                    icon={"shopping-cart"}
                    to={`/associations/${association.id}/marketplace`}
                >
                    Magasin
                </SidebarItem>
            </Sidebar>
        );
    }

    return null;
};

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
