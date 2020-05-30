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
import { Association } from "../../models/associations/association";

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
                    exact={false}
                >
                    Événements
                </SidebarItem>
                <SidebarItem
                    icon={"file"}
                    to={`/associations/${association.id}/fichiers`}
                    exact={false}
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
                {association.myRole.permissions?.includes("administration") && (
                    <SidebarItem
                        icon={"settings"}
                        to={`/associations/${association.id}/parametres`}
                    >
                        Paramètres
                    </SidebarItem>
                )}
                {association.myRole.permissions?.includes("marketplace") && (
                    <MarketSubNavbar association={association} />
                )}
                <EventSubSidebar association={association} />
            </Sidebar>
        );
    }

    return null;
};

const ListPagesItem = ({ pages, association }) =>
    pages.map((page) => (
        <SidebarItem
            icon={"book"}
            to={
                page.title === "Accueil"
                    ? `/associations/${association.id}`
                    : `/associations/${association.id}/pages/${page.id}`
            }
            key={page.id}
        >
            {page.title}
        </SidebarItem>
    ));

const AddPageItem = ({ association }) =>
    association.myRole.permissions?.includes("page") ? (
        <SidebarItem
            icon={"plus"}
            to={`/associations/${association.id}/pages/nouvelle`}
        >
            Ajouter une page
        </SidebarItem>
    ) : null;

const EventSubSidebar = ({ association }: { association: Association }) => {
    const location = useLocation();
    return location.pathname.startsWith(
        `/associations/${association.id}/evenements`
    ) ? (
        <>
            <SidebarSpace />
            <SidebarItem
                icon={"calendar"}
                to={`/associations/${association.id}/evenements`}
            >
                À venir
            </SidebarItem>
            <SidebarItem
                icon={"inbox"}
                to={`/associations/${association.id}/evenements/passes`}
            >
                Passés
            </SidebarItem>
            {association.myRole?.permissions?.includes("event") && (
                <SidebarItem
                    icon={"plus"}
                    to={`/associations/${association.id}/evenements/creer`}
                >
                    Nouveau
                </SidebarItem>
            )}
        </>
    ) : null;
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
