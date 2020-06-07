import { Association } from "../../models/associations/association";
import { AssociationRoute } from "../associations";
import { AssociationShowPage } from "../../components/associations/page/show/AssociationShowPage";
import { AssociationEditPage } from "../../components/associations/page/edit/AssociationEditPage";
import { AssociationCreatePage } from "../../components/associations/page/create/AssociationCreatePage";

export const routes: (association: Association) => AssociationRoute[] = (
    association
) => [
    {
        path: `/pages/creer`,
        component: AssociationCreatePage,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
    {
        path: `/pages/:pageId`,
        component: AssociationShowPage,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
    {
        path: `/pages/:pageId/modifier`,
        component: AssociationEditPage,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
];
