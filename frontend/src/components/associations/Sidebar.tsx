import React from "react";
import {
    api,
    PaginatedResponse,
    useBetterQuery,
} from "../../services/apiService";
import { Sidebar, SidebarItem, SidebarSpace } from "../utils/sidebar/Sidebar";
import { Page } from "../../models/associations/page";
import { Loading } from "../utils/Loading";
import { useLocation } from "react-router-dom";

export const AssociationSidebar = ({ association }) => {
    const { data: pages, status, error } = useBetterQuery<
        PaginatedResponse<Page[]>
    >(["pages.list", association.id], api.pages.list);

    if (status === "loading") {
        return <Loading />;
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
                    icon={"calendar"}
                    to={`/associations/${association.id}/evenements`}
                >
                    Événements
                </SidebarItem>
                <SidebarItem
                    icon={"file"}
                    to={`/associations/${association.id}/fichiers`}
                >
                    Fichiers
                </SidebarItem>
                <SidebarItem
                    icon={"shopping-cart"}
                    to={`/associations/${association.id}/magasin`}
                    exact={false}
                >
                    Magasin
                </SidebarItem>
                {association.myRole.permissions.includes("administration") && (
                    <SidebarItem
                        icon={"settings"}
                        to={`/associations/${association.id}/parametres`}
                    >
                        Paramètres
                    </SidebarItem>
                )}
                {association.myRole.permissions.includes("marketplace") && (
                    <MarketSubNavbar association={association} />
                )}
            </Sidebar>
        );
    }

    return null;
};

const ListPagesItem = ({ pages, association }) =>
    pages.map((page) => (
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

const MarketSubNavbar = ({ association }) => {
    const location = useLocation();
    return location.pathname.startsWith(
        `/associations/${association.id}/magasin`
    ) ? (
        <>
            <SidebarSpace />
            <SidebarItem
                icon={"home"}
                to={`/associations/${association.id}/magasin`}
            >
                Accueil
            </SidebarItem>
            <SidebarItem
                icon={"dollar-sign"}
                to={`/associations/${association.id}/magasin/comptoir`}
            >
                Comptoir
            </SidebarItem>
            <SidebarItem
                icon={"book-open"}
                to={`/associations/${association.id}/magasin/commandes`}
            >
                Commandes
            </SidebarItem>
            <SidebarItem
                icon={"settings"}
                to={`/associations/${association.id}/magasin/produits`}
            >
                Produits
            </SidebarItem>
        </>
    ) : null;
};
