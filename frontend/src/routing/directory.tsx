import { Route } from "./global";
import { DirectoryDoctors } from "../components/directory/doctors/DirectoryDoctors";
import { Redirect } from "react-router";
import React from "react";

export const routes: Route[] = [
  {
    path: "",
    component: () => <Redirect to="/annuaire/medecins" />,
    exact: true,
  },
  {
    path: "/medecins",
    component: DirectoryDoctors,
    exact: true,
  },
];
