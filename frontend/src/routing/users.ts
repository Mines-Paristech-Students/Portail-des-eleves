import { Route } from "./global";
import { UserProfile } from "../components/user/profile/UserProfile";
import { Trombi } from "../components/user/trombi/Trombi";
import { EditUserProfile } from "../components/user/edit_profile/EditUserProfile";

export const routes: Route[] = [
    {
        path: "/trombi",
        component: Trombi,
        exact: true,
    },
    {
        path: `/profils/modifier`,
        component: EditUserProfile,
        exact: true,
    },
    {
        path: `/profils/:userId`,
        component: UserProfile,
        exact: true,
    },
];
