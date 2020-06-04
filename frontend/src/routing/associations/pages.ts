import { Association } from "../../models/associations/association";
import { AssociationRoute } from "../associations";
import {
    AssociationCreatePage,
    AssociationEditPage,
} from "../../components/associations/page/Edit";
import { AssociationShowPage } from "../../components/associations/page/Show";

export const routes: (association: Association) => AssociationRoute[] = (
    association
) => [
    {
        path: `/pages/nouvelle`,
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
