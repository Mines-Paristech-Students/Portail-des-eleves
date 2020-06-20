import { AssociationRoute } from "../associations";
import { AssociationLibraryHome } from "../../components/associations/library/home/AssociationLibraryHome";
import { AssociationLibraryManagement } from "../../components/associations/library/management/AssociationLibraryManagement";
import { AssociationLoanableEdit } from "../../components/associations/library/management/AssociationLoanableEdit";

export const routes: AssociationRoute[] = [
  {
    path: `/bibliotheque`,
    component: AssociationLibraryHome,
    exact: true,
    defaultLayout: false,
  },
  {
    path: `/bibliotheque/gestion`,
    component: AssociationLibraryManagement,
    exact: true,
    defaultLayout: false,
  },
  {
    path: `/bibliotheque/gestion/:loanableId/modifier`,
    component: AssociationLoanableEdit,
    exact: true,
    defaultLayout: false,
  },
];
