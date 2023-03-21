import { Route } from "./global";
import { UserProfile } from "../components/user/profile/UserProfile";
import { Trombi } from "../components/user/trombi/Trombi";
import { Genealogy } from "../components/user/trombi/Genealogy";
import { EditUserProfile } from "../components/user/profile/edit/EditUserProfile";
import { Redirect } from "react-router-dom";

export const routes: Route[] = [
  {
    path: "/trombi",
    component: Trombi,
    exact: true,
  },
  {
    path: "/profils",
    component: () => new Redirect({ to: { pathname: "/trombi" } }),
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
  {
    path: "/genealogy",
    component: Genealogy,
    exact: true,
  },
];
