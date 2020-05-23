import React from "react";
import { SidebarItem, SidebarSeparator } from "../../Sidebar";

export const ListEventsSidebar = ({ association }) => (
    <>
        <SidebarSeparator />
        <SidebarItem
            icon={"home"}
            to={`/associations/${association.id}/marketplace`}
        >
            Accueil
        </SidebarItem>
        <SidebarItem
            icon={"dollar-sign"}
            to={`/associations/${association.id}/marketplace/counter`}
        >
            Comptoir
        </SidebarItem>
        <SidebarItem
            icon={"book-open"}
            to={`/associations/${association.id}/marketplace/orders`}
        >
            Commandes
        </SidebarItem>
        <SidebarItem
            icon={"settings"}
            to={`/associations/${association.id}/marketplace/products`}
        >
            Produits
        </SidebarItem>
    </>
);
