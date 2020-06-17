import { AssociationRoute } from "../associations";
import { AssociationRolesAdministration } from "../../components/associations/roles/administration/AssociationRolesAdministration";
import { ListRoles } from "../../components/associations/roles/list/ListRoles";

export const routes: AssociationRoute[] = [
  {
    path: "/membres/",
    component: ListRoles,
    exact: true,
    props: {
      title: "Membres actuels",
      apiParameters: {
        is_active: true,
      },
    },
    defaultLayout: true,
  },
  {
    path: "/membres/anciens",
    component: ListRoles,
    exact: true,
    props: {
      title: "Anciens membres",
      apiParameters: {
        end_date_before: Date(),
      },
    },
    defaultLayout: true,
  },
  {
    path: "/membres/administration",
    component: AssociationRolesAdministration,
    exact: true,
    defaultLayout: true,
  },
];
