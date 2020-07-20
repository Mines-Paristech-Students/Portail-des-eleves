import { AssociationRoute } from "../associations";
import { AssociationViewElection } from "../../components/associations/elections/view/View";
import { AssociationListElection } from "../../components/associations/elections/list/List";
import { AssociationCreateElection } from "../../components/associations/elections/create/Create";

export const routes: AssociationRoute[] = [
  {
    path: "/votes/",
    component: AssociationListElection,
    exact: true,
    defaultLayout: true,
  },
  {
    path: "/votes/nouveau",
    component: AssociationCreateElection,
    exact: true,
    defaultLayout: true,
  },
  {
    path: "/votes/:electionId",
    component: AssociationViewElection,
    exact: true,
    defaultLayout: true,
  },
];
