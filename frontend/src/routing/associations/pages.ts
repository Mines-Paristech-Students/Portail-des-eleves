import { AssociationRoute } from "../associations";
import { AssociationShowPage } from "../../components/associations/page/show/AssociationShowPage";
import { AssociationEditPage } from "../../components/associations/page/edit/AssociationEditPage";
import { AssociationCreatePage } from "../../components/associations/page/create/AssociationCreatePage";

export const routes: AssociationRoute[] = [
    {
        path: `/pages/creer`,
        component: AssociationCreatePage,
        exact: true,
        defaultLayout: true,
    },
    {
        path: `/pages/:pageId`,
        component: AssociationShowPage,
        exact: true,
        defaultLayout: true,
    },
    {
        path: `/pages/:pageId/modifier`,
        component: AssociationEditPage,
        exact: true,
        defaultLayout: true,
    },
];
