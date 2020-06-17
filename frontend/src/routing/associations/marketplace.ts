import { AssociationMarketplaceHome } from "../../components/associations/marketplace/Home";
import { AssociationMarketplaceHistory } from "../../components/associations/marketplace/History";
import { AssociationMarketplaceOrders } from "../../components/associations/marketplace/Orders";
import { AssociationMarketplaceCounter } from "../../components/associations/marketplace/Counter";
import { AssociationMarketplaceProductAdministration } from "../../components/associations/marketplace/Administration";
import { AssociationMarketplaceProductEdit } from "../../components/associations/marketplace/Edit";
import { AssociationRoute } from "../associations";
import { AssociationMarketplaceProductCreate } from "../../components/associations/marketplace/Create";

export const routes: AssociationRoute[] = [
    {
        path: `/magasin`,
        component: AssociationMarketplaceHome,
        exact: true,
        defaultLayout: false,
    },
    {
        path: `/magasin/historique`,
        component: AssociationMarketplaceHistory,
        exact: true,
        defaultLayout: true,
    },

    {
        path: `/magasin/commandes`,
        component: AssociationMarketplaceOrders,
        exact: true,
        defaultLayout: false,
    },
    {
        path: `/magasin/comptoir`,
        component: AssociationMarketplaceCounter,
        exact: true,
        defaultLayout: true,
    },
    {
        path: `/magasin/produits`,
        component: AssociationMarketplaceProductAdministration,
        exact: true,
        defaultLayout: false,
    },

    {
        path: `/magasin/produits/nouveau`,
        component: AssociationMarketplaceProductCreate,
        exact: true,
        defaultLayout: true,
    },

    {
        path: `/magasin/produits/:productId/modifier`,
        component: AssociationMarketplaceProductEdit,
        exact: true,
        defaultLayout: true,
    },
];
