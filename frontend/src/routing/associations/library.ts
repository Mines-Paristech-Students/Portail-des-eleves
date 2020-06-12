import { Association } from "../../models/associations/association";
import { AssociationRoute } from "../associations";
import { AssociationLibraryHome } from "../../components/associations/library/home/AssociationLibraryHome";

export const routes: (association: Association) => AssociationRoute[] = (
    association
) => [
    {
        path: `/bibliotheque`,
        component: AssociationLibraryHome,
        exact: true,
        props: { association: association },
        defaultLayout: false,
    },
];
