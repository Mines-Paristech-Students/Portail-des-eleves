import { Association } from "../../models/associations/association";
import { AssociationRoute } from "../associations";
import { AssociationRolesAdministration } from "../../components/associations/roles/administration/AssociationRolesAdministration";

export const routes: (association: Association) => AssociationRoute[] = (association) => [
  {
        path: "/membres/",
        component: (...props) => null,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
    {
        path: "/membres/anciens",
        component: (...props) => null,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
    {
        path: "/membres/administration",
        component: AssociationRolesAdministration,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
];
