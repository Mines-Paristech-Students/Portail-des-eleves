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

export const AssociationSidebar = ({ association }) => (
  <Sidebar title={association.name}>
    <SidebarItem
      icon={"home"}
      to={`/associations/${association.id}`}
      exact={true}
    >
      Accueil
    </SidebarItem>
    <SidebarItem
      icon={"book-open"}
      to={`/associations/${association.id}/pages`}
      exact={false}
    >
      Pages
    </SidebarItem>
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
      icon={"book"}
      to={`/associations/${association.id}/bibliotheque`}
      exact={false}
    >
      Bibliothèque
    </SidebarItem>
    <SidebarItem
      icon={"shopping-cart"}
      to={`/associations/${association.id}/magasin`}
      exact={false}
    >
      Magasin
    </SidebarItem>
    <SidebarItem
      icon={"users"}
      to={`/associations/${association.id}/membres`}
      exact={false}
    >
      Membres
    </SidebarItem>
    {association.myRole.permissions?.includes("administration") && (
      <SidebarItem
        icon={"settings"}
        to={`/associations/${association.id}/parametres`}
      >
        Paramètres
      </SidebarItem>
    )}
    <EventSubSidebar association={association} />
    <LibrarySubSidebar association={association} />
    {association.myRole.permissions?.includes("marketplace") && (
      <MarketSubSidebar association={association} />
    )}
    <PageSubSidebar association={association} />
    <RolesSubSidebar association={association} />
  </Sidebar>
);

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

const LibrarySubSidebar = ({ association }: { association: Association }) => {
  const location = useLocation();
  return location.pathname.startsWith(
    `/associations/${association.id}/bibliotheque`
  ) ? (
    <>
      <SidebarSpace />
      <SidebarItem
        icon={"home"}
        to={`/associations/${association.id}/bibliotheque`}
      >
        Accueil
      </SidebarItem>
      <SidebarItem
        icon={"book-open"}
        to={`/associations/${association.id}/bibliotheque/historique`}
      >
        Mes demandes
      </SidebarItem>
      {association.myRole?.permissions?.includes("library") && (
        <SidebarItem
          icon={"settings"}
          to={`/associations/${association.id}/bibliotheque/gestion`}
          exact={false}
        >
          Gestion
        </SidebarItem>
      )}
    </>
  ) : null;
};

const MarketSubSidebar = ({ association }) => {
  const location = useLocation();
  return location.pathname.startsWith(
    `/associations/${association.id}/magasin`
  ) ? (
    <>
      <SidebarSpace />
      <SidebarItem icon={"home"} to={`/associations/${association.id}/magasin`}>
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

const PageSubSidebar = ({ association }: { association: Association }) => {
  const location = useLocation();
  const { data: pages, status, error } = useBetterQuery<
    PaginatedResponse<Page[]>
  >(
    ["pages.list", { association_id: association.id, page_type: "STATIC" }],
    api.pages.list
  );

  return status === "loading" ? (
    <Loading />
  ) : error ? (
    <p>Erreur lors du chargement</p>
  ) : pages &&
    location.pathname.startsWith(`/associations/${association.id}/pages`) ? (
    <>
      <SidebarSpace />
      <SidebarItem icon="radio" to={`/associations/${association.id}/pages`}>
        Brèves
      </SidebarItem>

      {pages.results
        .filter((page) => page.title !== "Accueil")
        .sort((p1, p2) => p1.title.localeCompare(p2.title))
        .map((page) => (
          <SidebarItem
            icon="book-open"
            to={`/associations/${association.id}/pages/${page.id}`}
            exact={false}
            key={page.id}
          >
            {page.title}
          </SidebarItem>
        ))}

      {association.myRole?.permissions?.includes("page") && (
        <SidebarItem
          icon="plus"
          to={`/associations/${association.id}/pages/creer`}
        >
          Nouvelle page
        </SidebarItem>
      )}
    </>
  ) : null;
};

const RolesSubSidebar = ({ association }: { association: Association }) => {
  const location = useLocation();
  return location.pathname.startsWith(
    `/associations/${association.id}/membres`
  ) ? (
    <>
      <SidebarSpace />
      <SidebarItem
        icon={"users"}
        to={`/associations/${association.id}/membres`}
      >
        Actuels
      </SidebarItem>
      <SidebarItem
        icon={"inbox"}
        to={`/associations/${association.id}/membres/anciens`}
      >
        Anciens
      </SidebarItem>
      {association.myRole?.permissions?.includes("administration") && (
        <SidebarItem
          icon={"settings"}
          to={`/associations/${association.id}/membres/administration`}
        >
          Gestion
        </SidebarItem>
      )}
    </>
  ) : null;
};
