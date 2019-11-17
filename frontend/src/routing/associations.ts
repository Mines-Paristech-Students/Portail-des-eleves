import { AssociationHome } from "../pages/associations/home";
import { AssociationShowPage } from "../pages/associations/page/show";
import { AssociationCreatePage } from "../pages/associations/page/edit";

export const routes = association => [
    {
        path: `/`,
        component: AssociationHome,
        exact: true,
        props: { association: association, myValue: 3 }
    },
    {
        path: `/pages/new`,
        component: AssociationCreatePage,
        exact: true,
        props: { association: association }
    },
    {
        path: `/pages/:pageId`,
        component: AssociationShowPage,
        exact: true,
        props: { association: association }
    }
];