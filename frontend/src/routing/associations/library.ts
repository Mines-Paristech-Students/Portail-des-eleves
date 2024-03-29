import { AssociationRoute } from "../associations";
import { AssociationLibraryHome } from "../../components/associations/library/home/AssociationLibraryHome";
import { AssociationLibraryManagement } from "../../components/associations/library/management/AssociationLibraryManagement";
import { AssociationLoanableEdit } from "../../components/associations/library/management/AssociationLoanableEdit";
import { AssociationLoanableCreate } from "../../components/associations/library/management/AssociationLoanableCreate";
import { AssociationManageLoans } from "../../components/associations/library/management/loans/AssociationManageLoans";
import { AssociationLibraryHistory } from "../../components/associations/library/history/AssociationLibraryHistory";

export const routes: AssociationRoute[] = [
  {
    path: `/bibliotheque`,
    component: AssociationLibraryHome,
    exact: true,
    defaultLayout: false,
  },
  {
    path: `/bibliotheque/historique`,
    component: AssociationLibraryHistory,
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
    path: `/bibliotheque/gestion/ajouter`,
    component: AssociationLoanableCreate,
    exact: true,
    defaultLayout: true,
  },
  {
    path: `/bibliotheque/gestion/:loanableId/modifier`,
    component: AssociationLoanableEdit,
    exact: true,
    defaultLayout: true,
  },
  {
    path: `/bibliotheque/gestion/:loanableId/demandes`,
    component: AssociationManageLoans,
    exact: true,
    defaultLayout: false,
  },
];
