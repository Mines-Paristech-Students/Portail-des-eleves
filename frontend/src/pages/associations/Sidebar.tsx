import React from "react";
import { api, useBetterQuery } from "../../services/apiService";
import {Sidebar, SidebarCategory, SidebarItem} from "../../utils/Sidebar";
import { Page } from "../../models/associations/page";

export const AssociationSidebar = ({ association }) => {
    const { data: pages, status, error } = useBetterQuery<Page[]>(
        "pages.list",
        api.pages.list,
        association.id
    );


    if (status === "loading") {
        return <p>Chargement...</p>;
    } else if (error) {
        return <p>Erreur lors du chargement</p>;
    } else if (association) {
        return (
            <Sidebar title={association.name}>

                <SidebarItem
                    icon={"file"}
                    to={`/associations/${association.id}/files`}
                >
                    Fichiers
                </SidebarItem>
                <SidebarCategory title={"Élections"}>
                    <SidebarItem
                        icon={"calendar"}
                        to={`/associations/${association.id}/elections-upcoming`}
                    >
                        À venir
                    </SidebarItem>
                    <SidebarItem
                        icon={"check-square"}
                        to={`/associations/${association.id}/elections-current`}
                    >
                        En cours
                    </SidebarItem>
                    <SidebarItem
                        icon={"bar-chart-2"}
                        to={`/associations/${association.id}/elections-past`}
                    >
                        Résultats
                    </SidebarItem>
                    <AddElectionItem association={association}/>
                </SidebarCategory>
                <SidebarCategory title={"Pages"}>
                    <ListPagesItem association={association} pages={pages} />
                    <AddPageItem association={association} />
                </SidebarCategory>

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

const AddElectionItem = ({ association }) => {
    if (association.myRole.electionPermission) {
        return (
            <SidebarItem
                icon={"plus"}
                to={`/associations/${association.id}/elections/new`}
            >
                Nouvelle élection
            </SidebarItem>
        );
    }
    return null
};