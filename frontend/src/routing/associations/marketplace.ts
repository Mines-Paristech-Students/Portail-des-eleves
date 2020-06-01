import { AssociationMarketplaceHome } from "../../components/associations/marketplace/Home";
import { AssociationMarketplaceHistory } from "../../components/associations/marketplace/History";
import { AssociationMarketplaceOrders } from "../../components/associations/marketplace/Orders";
import { AssociationMarketplaceCounter } from "../../components/associations/marketplace/Counter";
import { AssociationMarketplaceProductAdministration } from "../../components/associations/marketplace/Administration";
import { AssociationMarketplaceProductEdit } from "../../components/associations/marketplace/Edit";
import { Association } from "../../models/associations/association";
import { AssociationRoute } from "../associations";

export const routes: (association: Association) => AssociationRoute[] = (association) => [
    {
        path: `/magasin`,
        component: AssociationMarketplaceHome,
        exact: true,
        props: { association: association },
        defaultLayout: false,
    },
    {
        path: `/magasin/historique`,
        component: AssociationMarketplaceHistory,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },

    {
        path: `/magasin/commandes`,
        component: AssociationMarketplaceOrders,
        exact: true,
        props: { association: association },
        defaultLayout: false,
    },
    {
        path: `/magasin/comptoir`,
        component: AssociationMarketplaceCounter,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
    {
        path: `/magasin/produits`,
        component: AssociationMarketplaceProductAdministration,
        exact: true,
        props: { association: association },
        defaultLayout: false,
    },
    {
        path: `/magasin/produits/:productId/modifier`,
        component: AssociationMarketplaceProductEdit,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
];
