import { AssociationRoute } from "../associations";
import { AssociationLibraryHome } from "../../components/associations/library/home/AssociationLibraryHome";

export const routes: AssociationRoute[] = [
    {
        path: `/bibliotheque`,
        component: AssociationLibraryHome,
        exact: true,
        defaultLayout: false,
    },
];
