import { AssociationRoute } from "../associations";
import { AssociationShowPage } from "../../components/associations/page/show/AssociationShowPage";
import { AssociationEditPage } from "../../components/associations/page/edit/AssociationEditPage";
import { AssociationCreatePage } from "../../components/associations/page/create/AssociationCreatePage";
import { AssociationListNews } from "../../components/associations/page/list_news/AssociationListNews";

export const routes: AssociationRoute[] = [
  {
    path: `/pages/`,
    component: AssociationListNews,
    exact: true,
    defaultLayout: true,
  },
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
