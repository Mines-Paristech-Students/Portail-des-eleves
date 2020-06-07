import { Association } from "../../models/associations/association";
import { AssociationRoute } from "../associations";
import { AssociationRolesAdministration } from "../../components/associations/roles/administration/AssociationRolesAdministration";
import { ListRoles } from "../../components/associations/roles/list/ListRoles";

export const routes: (association: Association) => AssociationRoute[] = (
    association
) => [
    {
        path: "/membres/",
        component: ListRoles,
        exact: true,
        props: {
            association: association,
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
            association: association,
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
        props: { association: association },
        defaultLayout: true,
    },
];
